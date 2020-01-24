#!/usr/bin/env bash

set -e

docker build -t pow-mongodb-fixtures .
docker run pow-mongodb-fixtures
