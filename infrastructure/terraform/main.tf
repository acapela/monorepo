terraform {
  required_version = ">= 1.2.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.21.0"
    }
  }
  backend "gcs" {
    bucket  = "acapela-tf-state"
    prefix  = "tf-state"
  }
}


provider "google" {
  project     = "meetnomoreapp"
  region      = "eu-west-1"
}

locals {
  webhook_types = toset(["linear"])
}

module "pubsub" {
  for_each = local.webhook_types
  source = "./pubsub"
  name = each.value
}
