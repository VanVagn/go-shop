package database

import (
	"fmt"
	"go-shop/config"
	"go-shop/models"
	"gorm.io/driver/postgres"
	"log"

	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(cfg *config.Config) error {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	log.Println("Database connected successfully")
	return nil
}

func AutoMigrate() error {
	err := DB.AutoMigrate(&models.User{}, &models.Product{})
	if err != nil {
		return err
	}

	log.Println("Database migrated successfully")
	return nil
}
