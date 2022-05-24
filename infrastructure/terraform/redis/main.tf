variable "name" {
  type = string
}

data "google_compute_network" "default" {
  name = "default"
}

resource "google_redis_instance" "redis" {
  memory_size_gb     = 1
  name               = var.name
  redis_version      = "REDIS_6_X"
  tier               = "BASIC"
  authorized_network = data.google_compute_network.default.id
}

output "host" {
  value = google_redis_instance.redis.host
}
