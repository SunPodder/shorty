all: authorizer login me register resolve shorten

test:
	go test ./tests

authorizer:
	@echo "Building authorizer..."
	@GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o bin/authorizer ./cmd/authorizer/main.go
	@zip -j bin/authorizer.zip bin/authorizer
	@echo "Authorizer built successfully."

login:
	@echo "Building login..."
	@GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o bin/login ./cmd/login/main.go
	@zip -j bin/login.zip bin/login
	@echo "Login built successfully."

me:
	@echo "Building me..."
	@GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o bin/me ./cmd/me/main.go
	@zip -j bin/me.zip bin/me
	@echo "Me built successfully."

register:
	@echo "Building register..."
	@GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o bin/register ./cmd/register/main.go
	@zip -j bin/register.zip bin/register
	@echo "Register built successfully."

resolve:
	@echo "Building resolve..."
	@GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o bin/resolve ./cmd/resolve/main.go
	@zip -j bin/resolve.zip bin/resolve
	@echo "Resolve built successfully."

shorten:
	@echo "Building shorten..."
	@GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o bin/shorten ./cmd/shorten/main.go
	@zip -j bin/shorten.zip bin/shorten
	@echo "Shorten built successfully."

clean:
	@echo "Cleaning up..."
	@rm -rf bin
	@echo "All binaries cleaned successfully."