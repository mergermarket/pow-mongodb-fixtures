FROM node:14.14.0-slim
RUN apt-get update && apt-get install -y jq
WORKDIR /usr/src/app
COPY package.json package-lock.json .npmrc ./
COPY . ./
RUN npm ci