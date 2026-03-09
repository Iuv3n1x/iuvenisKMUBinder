package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// ------------------- Globale Variablen -------------------
var (
	host, user, password, dbname string
	port                         int
	jwtKey                       []byte
	db                           *sql.DB
)

// ------------------- Init -------------------
func init() {
	// .env laden
	if err := godotenv.Load(".env"); err != nil {
		log.Println("Keine .env Datei gefunden, nutze Environment Variables")
	}

	// Env Variablen auslesen + Defaults
	host = getEnv("DB_HOST", "localhost")
	port = getEnvInt("DB_PORT", 5432)
	user = getEnv("DB_USER", "postgres")
	password = getEnv("DB_PASSWORD", "")
	dbname = getEnv("DB_NAME", "postgres")
	jwtKey = []byte(getEnv("JWT_KEY", "defaultsecret"))
}

// ------------------- Helper Funktionen -------------------
func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.Atoi(v); err == nil {
			return i
		}
	}
	return fallback
}

// ------------------- User Struct -------------------
type User struct {
	Firstname        string    `json:"firstname"`
	Lastname         string    `json:"lastname"`
	Email            string    `json:"email"`
	Passwordhash     string    `json:"passwordhash"`
	Registrationdate time.Time `json:"registrationdate"`
	Birthdate        time.Time `json:"birthdate"`
}

// ------------------- Main -------------------
func main() {
	var err error
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/users", handleUsers)
	mux.HandleFunc("/login", handleLogin)
	mux.HandleFunc("/auth/check", handleCheckAuth)

	fmt.Println("Server läuft auf :8080")
	log.Fatal(http.ListenAndServe(":8080", cors(mux)))
}

// ------------------- CORS -------------------
func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ------------------- Signup -------------------
func handleUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var u User
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	u.Registrationdate = time.Now()

	if err := addUser(u); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User added!"})
}

func addUser(u User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Passwordhash), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	var userID int
	query := `INSERT INTO users (firstname, lastname, email, passwordhash, registrationdate, birthdate)
	          VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	err = db.QueryRow(query, u.Firstname, u.Lastname, u.Email, string(hashedPassword), u.Registrationdate, u.Birthdate).Scan(&userID)
	if err != nil {
		return err
	}

	query = `INSERT INTO earnings (userid, streak, higheststreak) VALUES ($1, $2, $3)`
	_, err = db.Exec(query, userID, 0, 0)
	return err
}

// ------------------- Login -------------------
func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds struct {
		Email      string `json:"email"`
		Password   string `json:"password"`
		StayLogged bool   `json:"stayLogged"`
	}

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ok, userID, err := checkUser(creds.Email, creds.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if !ok {
		json.NewEncoder(w).Encode(map[string]bool{"success": false})
		return
	}

	var tokenExpiry time.Time
	if creds.StayLogged {
		tokenExpiry = time.Now().Add(30 * 24 * time.Hour)
	} else {
		tokenExpiry = time.Now().Add(24 * time.Hour)
	}

	claims := jwt.MapClaims{
		"userid": userID,
		"exp":    tokenExpiry.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Expires:  tokenExpiry,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	})

	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}

// ------------------- User prüfen -------------------
func checkUser(email, password string) (bool, int, error) {
	var hashedPassword string
	var userID int
	query := `SELECT id, passwordhash FROM users WHERE email=$1`
	err := db.QueryRow(query, email).Scan(&userID, &hashedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, 0, nil
		}
		return false, 0, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)); err != nil {
		return false, 0, nil
	}

	return true, userID, nil
}

// ------------------- Auth Check -------------------
func handleCheckAuth(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("token")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	tokenString := cookie.Value
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// TODO: Login Rate Limiting
