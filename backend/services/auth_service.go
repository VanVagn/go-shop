package services

import (
	"errors"
	"go-shop/database"
	"go-shop/models"
	"go-shop/utils"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
)

type AuthService struct {
	jwtSecret []byte
}

func NewAuthService(jwtSecret string) *AuthService {
	return &AuthService{jwtSecret: []byte(jwtSecret)}
}

func (s *AuthService) SetAuthCookie(w http.ResponseWriter, token string) {
	cookie := &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		Path:     "/",
		MaxAge:   86400,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, cookie)
}

func (s *AuthService) ClearAuthCookie(w http.ResponseWriter) {
	cookie := &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)
}

func (s *AuthService) Register(username, password string) (*models.User, error) {
	var existingUser models.User
	if err := database.DB.Where("username = ?", username).First(&existingUser).Error; err == nil {
		return nil, errors.New("username already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("could not hash password")
	}
	user := models.User{
		Username:     username,
		PasswordHash: string(hashedPassword),
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return nil, errors.New("could not create user")
	}
	return &user, nil
}

func (s *AuthService) Login(username, password string) (string, *models.User, error) {
	var user models.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", nil, errors.New("invalid credentials")
		}
		return "", nil, errors.New("database error")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", nil, errors.New("invalid credentials")
	}

	token, err := utils.GenerateJWTToken(user.ID, s.jwtSecret)
	if err != nil {
		return "", nil, errors.New("could not generate token")
	}

	return token, &user, nil
}

func (s *AuthService) ValidateToken(tokenString string) (uint, error) {
	return utils.ValidateJWTToken(tokenString, s.jwtSecret)
}
