# Multi-stage build for production deployment
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN cd server && npm install --only=production
RUN cd client && npm install --only=production

# Copy source files
COPY server/src ./server/src
COPY client/public ./client/public
COPY client/server.js ./client/

# Final stage
FROM node:18-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app /app

# Create necessary directories
RUN mkdir -p /app/uploads /app/extracted && chmod 777 /app/uploads /app/extracted

# Expose ports
EXPOSE 5000 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Start both servers
CMD sh -c 'cd /app/server && npm start & cd /app/client && node server.js'
