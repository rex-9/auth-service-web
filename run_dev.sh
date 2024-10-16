#!/bin/bash

# Check if the containers are already running
if [ "$(docker-compose ps -q)" ]; then
  echo "Containers are already running. Starting without rebuild..."
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
else
  echo "Containers are not running. Building and starting..."
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
fi

# # Set the environment variables
# export VITE_REACT_APP_GOOGLE_CLIENT_ID=1026550055658-skeaoo2ipej0ntv2i5vtj3s7isgdhqg4.apps.googleusercontent.com
# export VITE_REACT_APP_SERVER_BASE_URL=http://localhost:3000
# export VITE_REACT_APP_CLIENT_BASE_URL=http://localhost:5173

# # Run the development server
# yarn dev
