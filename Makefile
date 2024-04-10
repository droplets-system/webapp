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
	npx @wharfkit/cli generate --url $(NODE_URL) $(CONTRACT_CORE) -f src/lib/contracts/$(CONTRACT_CORE).ts
	npx @wharfkit/cli generate --url $(NODE_URL) $(CONTRACT_EPOCH) -f src/lib/contracts/$(CONTRACT_EPOCH).ts
	npx @wharfkit/cli generate --url $(NODE_URL) eosio -f src/lib/contracts/eosio.ts
	npx @wharfkit/cli generate --url $(NODE_URL) eosio.token -f src/lib/contracts/eosio.token.ts

dev:
	yarn dev

.PHONY: clean
clean:
	rm -rf build/
