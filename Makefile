CLOSURE_DEPS	   = ./client/bin/closure/closure/bin/build/depswriter.py

deps:
	@mkdir -p ./client/bin/js
	$(CLOSURE_DEPS) --root_with_prefix="client/js ../../js" > ./client/bin/js/deps.js

.PHONY: deps