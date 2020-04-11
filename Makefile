install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

run:
	npx webpack-dev-server

test:
	npm run test

coverage:
	npm run test -- --coverage