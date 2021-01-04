###############################################################################
###############################################################################
##                      _______ _____ ______ _____                           ##
##                     |__   __/ ____|  ____|  __ \                          ##
##                        | | | (___ | |__  | |  | |                         ##
##                        | |  \___ \|  __| | |  | |                         ##
##                        | |  ____) | |____| |__| |                         ##
##                        |_| |_____/|______|_____/                          ##
##                                                                           ##
## description     : Dockerfile for TsED Application                         ##
## author          : TsED team                                               ##
## date            : 20210108                                                ##
## version         : 1.0                                                     ##
###############################################################################
###############################################################################
FROM node:14.15.2-alpine

RUN apk update

COPY package.json .
COPY yarn.lock .
COPY lerna.json .

RUN apk update && apk add build-base git python

COPY package.json .
COPY yarn.lock .
COPY processes.config.js .
COPY ./packages/server/package.json ./packages/server/package.json

RUN yarn install --production --frozen-lockfile --ignore-scripts

COPY ./packages/server ./packages/server

EXPOSE 8083
ENV PORT 8083

CMD ["yarn", "start:prod"]
