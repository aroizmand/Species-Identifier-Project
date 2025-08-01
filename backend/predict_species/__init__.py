import logging
import azure.functions as func
import json
import os
import torch
from torchvision import models, transforms
from PIL import Image
import io
from azure.storage.blob import BlobServiceClient

# --- Configuration ---
# IMPORTANT: Replace with your actual storage account name from Terraform output
STORAGE_ACCOUNT_NAME = "st8njejbdp"
MODEL_CONTAINER_NAME = "models"
MODEL_NAME = "species_identifier_model_v2.pth"
MODEL_PATH = "/tmp/" + MODEL_NAME # Use /tmp for temporary storage in Azure Functions

# --- Model Loading ---
# This part of the code runs only once, when the function app starts up.
# It downloads the model from blob storage to the function's temporary storage.

def download_model_from_blob():
    """Downloads the model from Azure Blob Storage if it doesn't already exist."""
    if not os.path.exists(MODEL_PATH):
        logging.info(f"Model not found at {MODEL_PATH}, downloading from blob storage...")
        try:
            # The connection string is automatically available as an environment variable in the Function App
            connect_str = os.getenv('AzureWebJobsStorage')
            blob_service_client = BlobServiceClient.from_connection_string(connect_str)
            
            blob_client = blob_service_client.get_blob_client(container=MODEL_CONTAINER_NAME, blob=MODEL_NAME)
            
            with open(file=MODEL_PATH, mode="wb") as download_file:
                download_file.write(blob_client.download_blob().readall())
            logging.info(f"Model downloaded successfully to {MODEL_PATH}")
        except Exception as e:
            logging.error(f"Failed to download model: {e}")
            # If the model fails to download, we can't continue.
            raise

# Download the model when the function app starts
download_model_from_blob()

# Load the model into memory
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
num_classes = 200 # We trained on 200 bird species
model = models.resnet18()
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, num_classes)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()
logging.info("PyTorch model loaded and ready.")

# Load class names (assuming they are in a file or hardcoded)
# In a real app, you'd load this from a file you upload alongside the model.
# For simplicity, we'll just use the number of classes.
# You would need to create and upload a 'class_names.txt' file for a full implementation.


# --- Image Transformation ---
def transform_image(image_bytes):
    """Applies the necessary transformations to the input image."""
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    return transform(image).unsqueeze(0)


# --- Main Function ---
def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        # Get the image from the POST request
        image_bytes = req.get_body()
        if not image_bytes:
            return func.HttpResponse(
                "Please pass an image in the request body",
                status_code=400
            )

        # Transform the image and move it to the device
        tensor = transform_image(image_bytes=image_bytes)
        tensor = tensor.to(device)

        # Make a prediction
        with torch.no_grad():
            outputs = model(tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_idx = torch.max(probabilities, 1)
            # Extract the predicted class index and confidence
            predicted_class_index = predicted_idx.item()
            prediction_confidence = confidence.item()

        logging.info(f"Prediction successful. Class index: {predicted_class_index}, Confidence: {prediction_confidence}")

        # Return the result as JSON
        results = {
            "predicted_class_index": predicted_class_index,
            "confidence": prediction_confidence
        }
        return func.HttpResponse(json.dumps(results), mimetype="application/json")

    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return func.HttpResponse("Error processing image.", status_code=500)

