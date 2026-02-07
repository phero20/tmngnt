FROM oven/bun:1 AS base
WORKDIR /app

# Copy package files
# The context is the root, so we copy from backend folder
COPY backend/package.json backend/bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY backend/ .

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
