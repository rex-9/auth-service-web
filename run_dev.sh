#!/bin/bash

# Check if the containers are already running
if [ "$(docker-compose ps -q)" ]; then
  echo "Containers are already running. Starting without rebuild..."
  docker-compose -f docker-compose.dev.yaml up
else
  echo "Containers are not running. Building and starting..."
  docker-compose -f docker-compose.dev.yaml up --build
fi
