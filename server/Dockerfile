FROM oven/bun:1

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN bun install --production

# Copy the rest of your app's source code
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the application
CMD ["bun", "main.ts"]