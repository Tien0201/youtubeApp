FROM node:20

WORKDIR /usr/node40

COPY package*.json ./  

RUN yarn install 

RUN yarn config set network-timeout 3000000

#prisma
COPY prisma ./prisma
RUN yarn prisma generate

COPY . . 

EXPOSE 8800

CMD [ "node" , "src/index.js" ]

## docker build . -t img-node 

# docker run -d -p 8800:8800 --network node-network --name cons-node img-node