# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) to workdir
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Build the project if TypeScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
ENV NODE_ENV production

# Run the compiled app
CMD ["node", "dist/app.js"]  # Adjust the path according to your output directory
