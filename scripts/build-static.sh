#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

set -- index.html styles.css script.js public/picker-data.js public/arcade-city.png public/meal-machine.svg \
  public/fonts/arcade-display.woff public/arcade-food/*.png

for asset do
  if [ ! -f "$asset" ]; then
    echo "Missing picker asset: $asset" >&2
    exit 1
  fi
done

rm -rf dist
mkdir -p dist/public/fonts dist/public/arcade-food
for asset do
  cp "$asset" "dist/$asset"
done
