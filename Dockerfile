# Use the official Bun image
FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN bun run build

# Expose the port your app runs on
EXPOSE 8080

# Start the app
CMD [ "bun", "run", "start" ]