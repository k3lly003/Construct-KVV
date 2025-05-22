# Use the official Node.js 20 image as the base
FROM node:20-slim AS base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a smaller Node.js runtime for the production image
FROM node:20-slim AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the base image
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./next
COPY --from=base /app/public ./public
COPY --from=base /app/package*.json ./

# Set the environment variable for production
ENV NODE_ENV=production

# Expose the port Next.js uses by default
EXPOSE 3000

# Command to start the Next.js application in production
CMD ["npm", "start"]

# You can also use the next start command directly
# CMD ["npx", "next", "start", "-p", "3000"]
