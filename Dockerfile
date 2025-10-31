# Use stable Node version
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies safely (ignore optional, use cache)
RUN npm install --no-optional --legacy-peer-deps

# Copy app source
COPY . .

# Expose the app port
EXPOSE 4000

# Start the backend
CMD ["npm", "start"]
