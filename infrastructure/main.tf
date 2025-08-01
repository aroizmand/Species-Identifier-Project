# Terraform Block: Defines the required providers for this configuration.
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~>3.0"
    }
  }
}

# Provider Block: Configures the Azure provider.
provider "azurerm" {
  features {}
}

# Random Pet resource: Generates a random, two-word name.
resource "random_pet" "rg_name" {
  prefix = "species-id"
  length = 2
}

# Random String resource: Guarantees a short, compliant name for the storage account.
resource "random_string" "storage_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Resource Group: A logical container for all our Azure resources.
resource "azurerm_resource_group" "main" {
  name     = random_pet.rg_name.id
  location = "Canada Central"
}

# Storage Account: Required by the Function App for its internal operations.
resource "azurerm_storage_account" "main" {
  name                     = "st${random_string.storage_suffix.result}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Azure Container Registry: A private registry to store our custom Docker images.
resource "azurerm_container_registry" "main" {
  name                = "acr${random_string.storage_suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Service Plan: Defines the hosting infrastructure for our Function App.
resource "azurerm_service_plan" "main" {
  name                = "asp-${random_pet.rg_name.id}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "B3"
}

# Linux Function App for Containers
resource "azurerm_linux_function_app" "main" {
  name                = "func-${random_pet.rg_name.id}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  storage_account_name       = azurerm_storage_account.main.name
  storage_account_access_key = azurerm_storage_account.main.primary_access_key
  service_plan_id            = azurerm_service_plan.main.id

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"        = "python"
    "DOCKER_REGISTRY_SERVER_URL"      = "https://@{azurerm_container_registry.main.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME" = azurerm_container_registry.main.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD" = azurerm_container_registry.main.admin_password
    "DOCKER_CUSTOM_IMAGE_NAME"        = "${azurerm_container_registry.main.login_server}/${random_pet.rg_name.id}:v4.0.0"
  }

  site_config {}
}

# --- NEW: Static Web App for Frontend ---
# FIX: Changed resource to the recommended 'azurerm_static_web_app'
# FIX: Changed location to 'westus2' which is available for this resource type.
resource "azurerm_static_web_app" "frontend" {
  name                = "app-${random_pet.rg_name.id}"
  resource_group_name = azurerm_resource_group.main.name
  location            = "West US 2"
}


# --- Output Blocks ---
output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "function_app_name" {
  value = azurerm_linux_function_app.main.name
}

output "acr_login_server" {
  value = azurerm_container_registry.main.login_server
}

output "acr_username" {
  value     = azurerm_container_registry.main.admin_username
  sensitive = true
}

output "acr_password" {
  value     = azurerm_container_registry.main.admin_password
  sensitive = true
}

# --- NEW: Output for Frontend URL ---
output "static_site_url" {
  value = "https://${azurerm_static_web_app.frontend.default_host_name}"
}
