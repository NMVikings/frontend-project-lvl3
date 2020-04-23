install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

start:
	npx webpack-dev-server

test:
	npm run test

test-coverage:
	npm run test -- --coverage