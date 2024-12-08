# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Install dependencies required for development
RUN apk add --no-cache libc6-compat

# Copy only package files initially
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]