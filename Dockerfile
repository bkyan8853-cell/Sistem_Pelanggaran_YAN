# Use lightweight Node.js image
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the frontend and bundle the backend
RUN npm run build

# Production runtime stage
FROM node:20-slim

WORKDIR /app

# Copy built outputs and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.data.json ./

# Install production dependencies only
RUN npm ci --only=production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Run the backend server
CMD ["node", "dist/server.cjs"]
