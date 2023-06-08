prepare-contracts:
	@echo "Compiling contracts..."
	@cd chain && npm install && npm run compile && ls -lah
	@echo "Compiled contracts!"

deploy-contracts: prepare-contracts
	@echo "Deploying contracts..."
	@cd chain && npm run deploy
	@echo "Deployed contracts!"

build-web:
	@echo "Building web..."
	@cd webapp && npm install && npm run build
	@echo "Built web!"
