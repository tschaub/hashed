.DELETE_ON_ERROR:

LIB_DIR = ./lib
DIST_DIR = ./dist
NODE_BIN = ./node_modules/.bin

LIB_SCRIPTS := $(shell find $(LIB_DIR) -name '*.js')

.PHONY: dist
dist: $(DIST_DIR)/hashed.js

$(DIST_DIR)/hashed.js: $(LIB_SCRIPTS) node_modules/.time
	@mkdir -p $(DIST_DIR)
	@$(NODE_BIN)/browserify --debug $(LIB_DIR)/index.js > $@

# Install Node based dependencies
node_modules/.time: package.json
	@npm prune
	@npm install
	@touch $@

.PHONY: clean-dist
clean-dist:
	@rm -rf $(DIST_DIR)
