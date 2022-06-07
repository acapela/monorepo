variable "name" {
  type = string
}

variable "memory_size_gb" {
  type    = number
  default = 1
}

data "google_compute_network" "default" {
  name = "default"
}

resource "google_redis_instance" "redis" {
  memory_size_gb     = var.memory_size_gb
  name               = var.name
  redis_version      = "REDIS_6_X"
  tier               = "BASIC"
  authorized_network = data.google_compute_network.default.id
}

output "host" {
  value = google_redis_instance.redis.host
}
