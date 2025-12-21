package handlers

import (
	"go-shop/models"
	"go-shop/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user, err := h.authService.Register(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User registered",
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
		},
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": "Invalid request"})
		return
	}

	token, user, err := h.authService.Login(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	h.authService.SetAuthCookie(c.Writer, token)

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  gin.H{"id": user.ID, "username": user.Username},
	})
}

func (h *AuthHandler) CheckAuth(c *gin.Context) {

	c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
	c.Header("Pragma", "no-cache")
	c.Header("Expires", "0")

	cookie, err := c.Request.Cookie("auth_token")

	if err != nil || cookie.Value == "" {
		c.JSON(http.StatusOK, gin.H{"authenticated": false})
		return
	}

	_, err = h.authService.ValidateToken(cookie.Value)
	if err != nil {

		h.authService.ClearAuthCookie(c.Writer)
		c.JSON(http.StatusOK, gin.H{"authenticated": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"authenticated": true})
}
func (h *AuthHandler) Logout(c *gin.Context) {
	h.authService.ClearAuthCookie(c.Writer)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}

// todo добавить блеклист для токенов
