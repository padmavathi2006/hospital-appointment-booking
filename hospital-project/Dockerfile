FROM node:20-alpine

WORKDIR /app

# Install only production dependencies (cached layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

ENV PORT=3100
EXPOSE 3100

# Wait for DynamoDB (if an endpoint is configured), then start the server
CMD ["sh", "-c", "node wait-for-db.js && node server.js"]
