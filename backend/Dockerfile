FROM node:20-alpine

WORKDIR /app

# Install nodemon globally just in case, or rely on local dependencies
RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
