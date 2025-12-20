package config

import "os"

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	RedisHost  string
	RedisPort  string
	JWTSecret  string
}

func Load() *Config {
	return &Config{
		DBHost:     getEnv("DB_HOST", "postgres"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "alexey"),
		DBPassword: getEnv("DB_PASSWORD", "alexey"),
		DBName:     getEnv("DB_NAME", "shop"),
		RedisHost:  getEnv("REDIS_HOST", "redis"),
		RedisPort:  getEnv("REDIS_PORT", "6379"),
		JWTSecret:  getEnv("JWT_SECRET", "your"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
