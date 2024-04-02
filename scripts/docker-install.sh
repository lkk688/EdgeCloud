#!/bin/bash

# Update package lists
sudo apt update

# Install necessary packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker repository GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Add Docker repository to system's software repositories
echo | sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"

# Update package lists again
sudo apt update

# Install Docker CE
sudo apt install -y docker-ce

# Check Docker service status
sudo systemctl status docker

# Add user to the Docker group
sudo usermod -aG docker $USER

