# Use official Node image
FROM node:18

# Create app directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy rest of the project files
COPY . .

# Expose the backend port
EXPOSE 4000

# Start the backend server
CMD ["npm", "start"]
