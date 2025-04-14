# FROM node:latest as builder

# WORKDIR /app

# COPY package*.json ./

# RUN npm install --legacy-peer-deps

# RUN npm install -g @angular/cli

# COPY . .

# #WORKDIR /app/frontend

# RUN ng build

# FROM nginx:alpine

# COPY --from=builder /app/frontend/dist/todo-app /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

# Use the official Node.js image as the base
FROM node:latest as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Build the Angular application
RUN ng build --configuration production

# Serve the application using Angular's development server
CMD ["ng", "serve", "--host", "0.0.0.0"]

