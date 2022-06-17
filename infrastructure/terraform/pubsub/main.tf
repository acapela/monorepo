
variable "name" {
  type = string
}

variable "prefix" {
  type    = string
  default = "webhooks"
}

locals {
  stages = toset(["development", "staging", "production", "chris"])
}

locals {
  topic_names = { for s in local.stages : s => "${s}-${var.prefix}-${var.name}" }
}

resource "google_pubsub_topic" "topic" {
  for_each = local.topic_names
  name     = each.value
}

resource "google_pubsub_subscription" "sub" {
  for_each                   = google_pubsub_topic.topic
  name                       = "${each.value.name}-sub"
  topic                      = each.value.name
  ack_deadline_seconds       = 60
  message_retention_duration = "604800s" # 7 days
  expiration_policy {
    ttl = "2678400s" # 31 days
  }
  retry_policy {
    minimum_backoff = "30s"
  }
}
