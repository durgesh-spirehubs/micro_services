FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV JWT_SECRET=${JWT_SECRET}
CMD ["npm", "start"]
