package main

import (
	"context"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"go-shop/config"
	"go-shop/database"
	"go-shop/handlers"
	"go-shop/services"
	"log"
	"time"
)

func main() {
	cfg := config.Load()

	if err := database.Connect(cfg); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err := database.AutoMigrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr:     cfg.RedisHost + ":" + cfg.RedisPort,
		Password: "",
		DB:       0,
	})

	if err := redisClient.Ping(context.Background()).Err(); err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}

	authService := services.NewAuthService(cfg.JWTSecret)
	cartService := services.NewCartService(redisClient)

	authHandler := handlers.NewAuthHandler(authService)
	productHandler := handlers.NewProductHandler()
	cartHandler := handlers.NewCartHandler(cartService)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost", "http://localhost:80", "http://127.0.0.1"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Public routes

	r.POST("/api/register", authHandler.Register)
	r.POST("/api/login", authHandler.Login)
	r.GET("/api/products", productHandler.GetProducts)
	r.GET("/api/auth/check", authHandler.CheckAuth)
	// Protected routes
	auth := r.Group("/api")
	auth.Use(handlers.AuthMiddleware(authService))
	{
		auth.POST("/logout", authHandler.Logout)
		auth.POST("/cart/add", cartHandler.AddToCart)
		auth.POST("/cart/remove", cartHandler.RemoveFromCart)
		auth.POST("/cart/update", cartHandler.UpdateCart)
		auth.GET("/cart", cartHandler.GetCart)
	}

	log.Println("Server starting on :8080")
	r.Run(":8080")

}
