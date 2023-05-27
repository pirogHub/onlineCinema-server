FROM node


WORKDIR /destination

COPY package.json /destination

RUN npm install --legacy-peer-deps

COPY . .


RUN npm run build

EXPOSE 4200

CMD ["node", "dist/main.js"]