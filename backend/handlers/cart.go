package handlers

import (
	"github.com/gin-gonic/gin"
	"go-shop/models"
	"go-shop/services"
	"net/http"
)

type CartHandler struct {
	cartService *services.CartService
}

func NewCartHandler(cartService *services.CartService) *CartHandler {
	return &CartHandler{cartService: cartService}
}

func (h *CartHandler) AddToCart(c *gin.Context) {
	userID := c.GetUint("userID")
	var req models.AddToCartRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
		return
	}

	if err := h.cartService.AddToCart(userID, req.ProductID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product added to cart"})
}

func (h *CartHandler) RemoveFromCart(c *gin.Context) {
	userID := c.GetUint("userID")
	var req models.RemoveFromCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
		return
	}

	if err := h.cartService.RemoveFromCart(userID, req.ProductID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product removed from cart"})
}

func (h *CartHandler) GetCart(c *gin.Context) {
	userID := c.GetUint("userID")

	cart, total, err := h.cartService.GetCart(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"cart":  cart,
		"total": total,
	})
}
