# Use an official Python runtime as the base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install the dependencies
RUN apt-get update && apt-get install -y ffmpeg libsndfile1
RUN pip install --upgrade pip
RUN --mount=type=cache,target=/root/.cache/pip \
  pip install torch==1.12.0+cu116 --extra-index-url https://download.pytorch.org/whl/cu116
RUN pip install -r requirements.txt

# Copy the application code
COPY . .

# Expose the port for the API
EXPOSE 3013

# Start the application
CMD ["python", "-m", "riffusion.server", "--host", "0.0.0.0", "--port", "3013", "--checkpoint", "riffusion/stable-diffusion-spectrogram-v1.5", "--device", "cuda"]