FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && \
    apt-get update && apt-get install -y ffmpeg

COPY . .

CMD [ "node", "index.js" ]