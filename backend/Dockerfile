FROM mcr.microsoft.com/azure-functions/python:4-python3.12

# Copy the requirements file and install dependencies
COPY requirements.txt /
RUN pip install -r /requirements.txt

# Copy the rest of the function app code
COPY . /home/site/wwwroot

# Set environment variables for the function app
ENV AzureWebJobsScriptRoot=/home/site/wwwroot
ENV AzureFunctionsJobHost__Logging__LogLevel__Default=Information