package handlers

import (
	"github.com/gin-gonic/gin"
	"go-shop/services"
	"net/http"
	"strings"
)

func AuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenString string
		if cookie, err := c.Request.Cookie("auth_token"); err == nil {
			tokenString = cookie.Value
		}
		if tokenString == "" {
			authHeader := c.GetHeader("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				tokenString = strings.TrimPrefix(authHeader, "Bearer ")
			} else {
				tokenString = authHeader
			}
		}
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		userID, err := authService.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		c.Set("userID", userID)
		c.Next()
	}
}
