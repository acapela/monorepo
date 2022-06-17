terraform {
  required_version = ">= 1.2.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.21.0"
    }
  }
  backend "gcs" {
    bucket = "acapela-tf-state"
    prefix = "tf-state"
  }
}


provider "google" {
  project = "meetnomoreapp"
  region  = "europe-west1"
}

locals {
  webhook_types = toset(["linear", "slack", "github", "asana", "clickup", "atlassian"])
  redis_stages  = toset(["staging", "production"])
  redis_memory_size_gb = {
    staging    = 1
    production = 5
  }
}

module "pubsub" {
  for_each = local.webhook_types
  source   = "./pubsub"
  name     = each.value
}


module "redis" {
  for_each       = local.redis_stages
  source         = "./redis"
  name           = each.value
  memory_size_gb = local.redis_memory_size_gb[each.value]
}

output "redis_endpoints" {
  value = { for k, s in module.redis : k => s.host }
}
