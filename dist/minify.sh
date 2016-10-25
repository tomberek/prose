#!/bin/sh
# This script must be run with super-user privileges.
# Usage: ./minify.sh file

set -e
file=$1
# cp ./.cabal-sandbox/bin/meditor.jsexe/all.js .
sed -i.bak "/goog.provide('goog.math.Long');/d" "$file"
sed -i.bak "/goog.provide('goog.crypt.Hash');/d" "$file"
sed -i.bak "/goog.provide('goog.crypt.Md5');/d" "$file"
sed -i.bak "/goog.require('goog.crypt.Hash');/d" "$file"
echo "(function(global) {" > "$file".new
cat "$file" >> "$file".new
echo "})(typeof global !== 'undefined' ? global : this);" >> "$file".new
closure-compiler --language_out=ES5 "$file".new > "$file".min
#closure-compiler all.new.js --compilation_level=ADVANCED_OPTIMIZATIONS > all.min.js
