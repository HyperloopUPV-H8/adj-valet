# Use an official Python runtime image.
FROM python:3.9-slim

# Set working directory.
WORKDIR /app

# Copy the project files into the container.
COPY . /app

# Install dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on.
EXPOSE 8000

# Run the FastAPI app using Uvicorn.
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
