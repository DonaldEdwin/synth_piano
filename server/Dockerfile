FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install curl for healthcheck
RUN apk add --no-cache curl

# Install dependencies
RUN npm install

# Copy the rest of the backend
COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
