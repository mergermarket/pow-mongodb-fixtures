#!/usr/bin/env bash
# Cannot set -o pipefail because `npm ls` could return non-zero exit code https://github.com/npm/npm/issues/17624
set -eux

PROJECT_NAME=$(jq -r .name < package.json)
IS_PACKAGE_PUBLISHED=$([ "$(npm view ${PROJECT_NAME} --json --silent | jq -r .error.code)" = "E404" ] && echo "false" || echo "true")
COMMITTED_VERSION=$(npm ls ${PROJECT_NAME} --json  | jq -r .version)
PUBLISHED_VERSION=$(npm view ${PROJECT_NAME} --json | jq -r .version)

echo "Is package published: $IS_PACKAGE_PUBLISHED"
echo "Committed version: $COMMITTED_VERSION"
echo "Published version: $PUBLISHED_VERSION"

if [ "$IS_PACKAGE_PUBLISHED" = "false" ]; then
  echo "Should publish: Yes. Package $PROJECT_NAME not yet published. Will publish for the first time."
  exit 0
fi

if [ $PUBLISHED_VERSION == "null" ]; then
  echo "Problem getting the published version of $PROJECT_NAME."
  exit 2
fi

if [ ${COMMITTED_VERSION} != ${PUBLISHED_VERSION} ]; then
    echo "Should publish: Yes. Current version ${COMMITTED_VERSION} is different from published version ${PUBLISHED_VERSION}."
    exit 0
else
    echo "Version $COMMITTED_VERSION of $PROJECT_NAME has already been published."
    exit 1
fi