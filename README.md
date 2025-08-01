Bird Species Identifier
=======================

**Live Demo:**  [**https://happy-smoke-0546a161e-preview.westus2.2.azurestaticapps.net**](https://happy-smoke-0546a161e-preview.westus2.2.azurestaticapps.net "null")

📖 Project Overview
-------------------

This project is a complete, end-to-end web application that uses a ml model to identify 200 different species of birds from an uploaded image. This project demonstrates a full MLOps pipeline, from training a high-performance deep learning model to deploying it as a scalable API and building a modern, responsive frontend for user interaction.

This repository contains the entire codebase, including the machine learning model training notebooks, the cloud infrastructure-as-code (IaC) files, the serverless backend API, and the frontend React application.

✨ Key Features
--------------

-   **Model:** Utilizes a Vision Transformer (ViT) model, fine-tuned to achieve **~89% accuracy** on the CUB-200-2011 dataset.

-   **Scalable Cloud Backend:** The API is deployed as a containerized, serverless function on Microsoft Azure, ensuring scalability and cost-efficiency.

-   **Infrastructure as Code (IaC):** The entire cloud environment is defined and managed with Terraform, enabling automated, repeatable, and version-controlled deployments.

-   **Modern Frontend:** Interface built with React (using Vite) and styled with Tailwind CSS for a fully responsive experience on any device.

-   **End-to-End MLOps:** A demonstration of a machine learning pipeline, from model development to production deployment.

🛠️ Technical Architecture
--------------------------

This project is divided into three core components, representing a full-stack application with a machine learning backend.

### 1\. Machine Learning Model

The "brain" of the application is a high-performance computer vision model.

-   **Model:** Vision Transformer (`vit_base_patch16_224`)

-   **Framework:** PyTorch

-   **Library:**  `timm` (PyTorch Image Models) for accessing state-of-the-art pre-trained models.

-   **Dataset:**  [CUB-200-2011](https://www.google.com/search?q=http://www.vision.caltech.edu/visipedia/CUB-200-2011.html "null"), a benchmark dataset of 200 bird species.

-   **Training:** The model was fine-tuned on a A100 GPU using Google Colab. Advanced techniques like the AdamW optimizer, a Cosine Annealing learning rate scheduler, and Automatic Mixed Precision (AMP) were used to achieve high accuracy and fast training times.

### 2\. Cloud Backend & DevOps

The backend is built on a robust, serverless architecture on Microsoft Azure.

-   **Infrastructure as Code:**  [**Terraform**](https://www.terraform.io/ "null") is used to define and manage all cloud resources, ensuring a consistent and automated setup.

-   **API Hosting:**  [**Azure Functions**](https://azure.microsoft.com/en-us/services/functions/ "null") provides the serverless compute to run our API code.

-   **Containerization:** The Python application is packaged into a [**Docker**](https://www.docker.com/ "null") container, which includes the model and all dependencies. This ensures consistency between the local and cloud environments.

-   **Container Registry:**  [**Azure Container Registry**](https://azure.microsoft.com/en-us/services/container-registry/ "null") securely stores our custom Docker images.

-   **Model Storage:**  [**Azure Blob Storage**](https://azure.microsoft.com/en-us/services/storage/blobs/ "null") is used to store the trained model file, which is downloaded by the function app on startup.

### 3\. Frontend Application

The user interface is a modern, single-page application.

-   **Framework:**  [**React**](https://reactjs.org/ "null") (using [**Vite**](https://vitejs.dev/ "null") for a fast development experience).

-   **Styling:**  [**Tailwind CSS**](https://tailwindcss.com/ "null") is used for a utility-first approach to create a responsive, custom design.

-   **Deployment:** The static site is deployed to [**Azure Static Web Apps**](https://www.google.com/search?q=https://azure.microsoft.com/en-us/services/app-service/static-web-apps/ "null") for global distribution and high performance.

🚀 Getting Started Locally
--------------------------

To run this project on your own machine, you will need to have the following prerequisites installed:

-   Node.js and npm

-   Python

-   Docker Desktop

-   Terraform

-   Azure CLI

**1\. Clone the repository:**

```
git clone https://github.com/aroizmand/Species-Identifier-Project.git
cd Species-Identifier-Project

```

**2\. Set up the Backend & Infrastructure:**

-   Follow the steps in the `infrastructure/` and `backend/` directories to deploy your own instance of the Azure resources using Terraform and Docker.

**3\. Set up the Frontend:**

-   Navigate to the frontend directory:

    ```
    cd frontend

    ```

-   Install the necessary packages:

    ```
    npm install

    ```

-   Update the `API_URL` constant in `src/App.jsx` to point to your own deployed Azure Function URL.

-   Start the development server:

    ```
    npm run dev

    ```

👤 Author
---------

-   **Alexander Roizman**

    -   [GitHub](https://github.com/aroizmand)

    -   [LinkedIn](https://www.linkedin.com/in/alexander-roizmand/)
