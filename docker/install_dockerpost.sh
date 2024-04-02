#!/bin/bash
# Install Docker on Ubuntu/Debian
sudo apt-get update
#sudo apt-get install -y docker.io
# Start and enable Docker service
#sudo systemctl start docker
#sudo systemctl enable docker
#sudo groupadd docker
# Check if the 'docker' group exists
if grep -q '^docker:' /etc/group; then
    echo "The 'docker' group already exists."
else
    # Create the 'docker' group
    sudo groupadd docker
    echo "The 'docker' group has been created."
fi
echo "Docker group finished"
addusercommand="sudo usermod -aG docker $USER"
#sudo usermod -aG docker $USER
# Execute the commands
eval "$addusercommand" || true  # Execute command1 and ignore errors
echo "Added docker user"
#log out and log back again, or run the following command
#newgrpcommand="newgrp docker"
#eval "$newgrpcommand" || true
echo "Finished docker rootless"
