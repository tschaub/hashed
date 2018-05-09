.DELETE_ON_ERROR:

LIB_DIR = ./lib
DIST_DIR = ./dist

export PATH := ./node_modules/.bin:$(PATH)
LIB_SCRIPTS := $(shell find $(LIB_DIR) -name '*.js')

# Creating release artifacts
.PHONY: dist
dist: $(DIST_DIR)/hashed.js $(DIST_DIR)/hashed.min.js

$(DIST_DIR)/hashed.js: $(LIB_SCRIPTS) node_modules/.time
	@mkdir -p $(DIST_DIR)
	@browserify $(LIB_DIR)/index.js --debug --standalone hashed > $@

$(DIST_DIR)/hashed.min.js: $(DIST_DIR)/hashed.js
	@uglifyjs $< > $@

.PHONY: clean
clean:
	@rm -rf $(DIST_DIR)

# Install Node based dependencies
node_modules/.time: package.json
	@npm install
	@touch $@

help:
	@echo ""
	@echo "make		- builds hashed.js and hashed.min.js"
	@echo "make clean	- remove build artifacts"
	@echo ""
