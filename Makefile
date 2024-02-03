BIN := ./node_modules/.bin

.EXPORT_ALL_VARIABLES:
NODE_URL ?= https://jungle4.greymass.com
CONTRACT_CORE = drops
CONTRACT_CORE_ACCOUNT = drops
CONTRACT_EPOCH = epoch.drops
CONTRACT_EPOCH_ACCOUNT = epoch.drops

.PHONY: build
build: webapp

.PHONY: webapp
webapp:
	yarn build

codegen:
	npx @wharfkit/cli generate --json ../drops/build/$(CONTRACT_CORE).abi --url $(NODE_URL) $(CONTRACT_CORE_ACCOUNT) -f src/lib/contracts/$(CONTRACT_CORE).ts
	npx @wharfkit/cli generate --json ../epoch/build/$(CONTRACT_EPOCH).abi --url $(NODE_URL) $(CONTRACT_EPOCH_ACCOUNT) -f src/lib/contracts/$(CONTRACT_EPOCH).ts

dev:
	yarn dev

.PHONY: clean
clean:
	rm -rf build/
