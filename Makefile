prepare-contracts:
	@echo "Compiling contracts..."
	@cd chain && npm install && npm run compile && ls -lah
	@echo "Compiled contracts!"

build-web:
	@echo "Building web..."
	@cd webapp && npm install && npm run build
	@echo "Built web!"
