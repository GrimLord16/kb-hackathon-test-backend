# Set the image name
$imageName = "kb_hackathon_test_b"

# Find containers running from the image
$runningContainers = docker ps -q --filter ancestor=$imageName

if ($runningContainers) {
    Write-Host "Stopping running containers from image $imageName."
    # Stop the running containers
    docker stop $runningContainers
    Write-Host "Removing stopped containers."
    # Remove the stopped containers
    docker rm $runningContainers
}

# Check if the Docker image already exists
$imageExists = docker image ls -q $imageName

if ($imageExists) {
    Write-Host "Image $imageName exists. Removing the existing image before rebuilding."
    # Remove the existing Docker image
    docker rmi $imageName -f
    Write-Host "Image $imageName has been removed."
} else {
    Write-Host "Image $imageName does not exist. Proceeding with the build."
}

# Build the Docker image
docker build -t $imageName .

# Check for success of the build process
if ($?) {
    Write-Host "Docker image $imageName built successfully."
    
    # Run the Docker container with the specified port mappings
    docker run -d -p 5005:3000 $imageName
    Write-Host "Docker container from image $imageName is running. Accessible at http://localhost:5000"
} else {
    Write-Host "Failed to build the Docker image $imageName."
}
