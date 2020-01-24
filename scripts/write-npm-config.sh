#!/bin/bash

set -e

[ -n "$GITHUB_TOKEN" ] || { echo "Error: Missing env var GITHUB_TOKEN"; exit 1; }

echo "@mergermarket:registry=https://npm.pkg.github.com/" > .npmrc
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
