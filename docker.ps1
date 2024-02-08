# Set the image name
$imageName = "kb_hackathon_test_b"

# Check if the Docker image already exists
$imageExists = docker image ls -q $imageName

if ($imageExists) {
    Write-Host "Image $imageName exists. Proceeding with force rebuild."
} else {
    Write-Host "Image $imageName does not exist. Building a new image."
}

# Build (or rebuild) the Docker image
docker build -t $imageName .

# Check for success of the build process
if ($?) {
    Write-Host "Docker image $imageName built successfully."
    
    # Run the Docker container with the specified port mappings
    docker run -d -p 5000:3000 $imageName
    Write-Host "Docker container from image $imageName is running. Accessible at http://localhost:5000"
} else {
    Write-Host "Failed to build the Docker image $imageName."
}
