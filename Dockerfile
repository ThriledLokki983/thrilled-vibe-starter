# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY index.js ./
COPY templates/ ./templates/
COPY README.md ./

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S cleanvibe -u 1001

# Make the CLI globally available (must be done as root)
RUN npm link

# Change ownership of the app directory to non-root user
RUN chown -R cleanvibe:nodejs /app

# Switch to non-root user
USER cleanvibe

# Create volume for output
VOLUME ["/output"]

# Set environment variables
ENV NODE_ENV=production
ENV OUTPUT_DIR=/output

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check passed')" || exit 1

# Default command
ENTRYPOINT ["clean-vibe"]
CMD ["--help"]

# Labels for metadata
LABEL maintainer="ThriledLokki983"
LABEL description="A PRD generator that provides AI agents with comprehensive instructions for creating well-structured frontend applications"
LABEL version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/ThriledLokki983/thrilled-vibe-starter"
LABEL org.opencontainers.image.documentation="https://github.com/ThriledLokki983/thrilled-vibe-starter#readme"
LABEL org.opencontainers.image.licenses="MIT"
