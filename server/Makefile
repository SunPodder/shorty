test:
	go test ./tests

# build all files under cmd into seperate binaries, put them in the bin dir
build:
	@echo "Building all binaries..."
	@for dir in $(shell find ./cmd -type d); do \
		if [ "$$dir" = "./cmd" ]; then continue; fi; \
		module=$$(basename $$dir); \
		echo "Building $$dir"; \
		GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o bin/cmd/$$module $$dir/main.go; \
		(cd bin/cmd && zip ../$$module.zip $$module); \
	done
	@echo "All binaries built successfully."


clean:
	@echo "Cleaning up..."
	@rm -rf bin
	@echo "All binaries cleaned successfully."