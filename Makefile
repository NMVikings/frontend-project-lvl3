install:
	npm ci

build:
	npx webpack

lint:
	npx eslint .

run:
	npx webpack-dev-server