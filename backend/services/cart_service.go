package services

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"go-shop/database"
	"go-shop/models"
	"strconv"
)

type CartService struct {
	redisClient *redis.Client
}

func NewCartService(redisClient *redis.Client) *CartService {
	return &CartService{redisClient: redisClient}
}

func (s *CartService) AddToCart(userID uint, productID string) error {
	cartkey := fmt.Sprintf("cart:%d", userID)
	_, err := s.redisClient.HIncrBy(context.Background(), cartkey, productID, 1).Result()
	return err
}

func (s *CartService) RemoveFromCart(userID uint, productID string) error {
	cartKey := fmt.Sprintf("cart:%d", userID)
	return s.redisClient.HDel(context.Background(), cartKey, productID).Err()
}

func (s *CartService) GetCart(userID uint) ([]map[string]interface{}, float64, error) {
	cartKey := fmt.Sprintf("cart:%d", userID)
	cartItems, err := s.redisClient.HGetAll(context.Background(), cartKey).Result()
	if err != nil {
		return nil, 0, err
	}

	var cart []map[string]interface{}
	var total float64

	for productIDStr, quantityStr := range cartItems {
		productID, _ := strconv.Atoi(productIDStr)
		quantity, _ := strconv.Atoi(quantityStr)

		var product models.Product
		if err := database.DB.First(&product, productID).Error; err == nil {
			itemTotal := product.Price * float64(quantity)
			total += itemTotal

			cart = append(cart, map[string]interface{}{
				"product":    product,
				"quantity":   quantity,
				"item_total": itemTotal,
			})
		}
	}
	return cart, total, nil
}
