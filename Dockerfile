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
RUN echo "VITE_ACCESS_KEY=$VITE_ACCESS_KEY" >> ./client/.env
RUN echo "VITE_ACCESS_TOKEN_SECRET=$VITE_ACCESS_TOKEN_SECRET" >> ./client/.env
RUN echo "VITE_TMDB_API=$VITE_TMDB_API" >> ./client/.env
RUN echo "VITE_API_KEY=$VITE_API_KEY" >> ./client/.env
RUN echo "VITE_AUTH_DOMAIN=$VITE_AUTH_DOMAIN" >> ./client/.env
RUN echo "VITE_PROJECT_ID=$VITE_PROJECT_ID" >> ./client/.env
RUN echo "VITE_STORAGE_BUCKET=$VITE_STORAGE_BUCKET" >> ./client/.env
RUN echo "VITE_MESSAGING_SENDER_ID=$VITE_MESSAGING_SENDER_ID" >> ./client/.env
RUN echo "VITE_APP_ID=$VITE_APP_ID" >> ./client/.env
# Build your app
RUN bun run build

# Expose the port your app runs on
EXPOSE 8080

# Start the app
CMD [ "bun", "run", "start" ]