package models

type AddToCartRequest struct {
	ProductID string `json:"product_id" binding:"required"`
}

type RemoveFromCartRequest struct {
	ProductID string `json:"product_id" binding:"required"`
}

type UpdateCartRequest struct {
	ProductID string `json:"product_id" binding:"required"`
	Change    int    `json:"change" binding:"required"`
}
