default:
	yarn

clean:
	rm -rf node_modules
	yarn cache clean

offline:
	@NODE_ENV=development \
	sls offline --skipCacheInvalidation

updates:
	yarn outdated

lint:
	./node_modules/eslint/bin/eslint.js ./

postinstall:
	cd ./node_modules; \
	ln -snf ../app; \
	ln -snf ../app/api; \
	ln -snf ../app/lib; \
	ln -snf ../app/modules; \
	ln -snf ../test;

test-unit:
	@NODE_ENV=test \
	node_modules/.bin/mocha \
	--exit \
	--bail \
	--slow 2000 \
	--timeout 20000 \
	./test/unit

test-int:
	@NODE_ENV=test \
	node node_modules/.bin/mocha \
	--exit \
	--bail \
	--slow 2000 \
	--timeout 20000 \
	./test/integration

test-all: test-unit test-int
