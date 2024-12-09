# Use Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY ./src ./src

# Expose the service port
EXPOSE 5001

# Start the service
CMD ["npm", "start"]
