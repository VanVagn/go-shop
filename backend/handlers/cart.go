package handlers

import (
	"github.com/gin-gonic/gin"
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
	productID := c.PostForm("product_id")

	if productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"errors": "Product ID required"})
		return
	}

	if err := h.cartService.AddToCart(userID, productID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product added to cart"})
}

func (h *CartHandler) RemoveFromCart(c *gin.Context) {
	userID := c.GetUint("userID")
	productID := c.PostForm("product_id")
	if productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID required"})
		return
	}

	if err := h.cartService.RemoveFromCart(userID, productID); err != nil {
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
