# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching layer)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
