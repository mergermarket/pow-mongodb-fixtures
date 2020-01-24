#!/usr/bin/env bash

set -e

docker build -t equities-reference-data .
docker run equities-reference-data
