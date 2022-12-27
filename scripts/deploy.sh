#!/bin/bash
set -eu
pnpm build
rm -rf ./dist/*
cp -r ./build/* ./dist/
cd ./dist && git add . && git commit -m "chore: deploy" && git push && cd -
# ^dist must be a recognized git submodule
