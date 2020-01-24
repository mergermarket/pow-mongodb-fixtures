#!/usr/bin/env bash
set -euxo pipefail

projectName=$1

# Clean up
rm -rf ./public
[ "$(docker ps -aq -f name=$projectName)" ] && docker rm $projectName

docker build -t $projectName .
docker run --name $projectName $projectName