FROM alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update --no-cache nodejs npm ffmpeg \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev && \
    npm install -g node-gyp && \
    npm install
COPY . .

CMD [ "node", "index.js" ]