group "default" {
  targets = ["great-wall-bootJar", "great-wall", "great-wall-g1gc"]
}

variable "IMAGE_REGISTRY" {
  default = "docker.io"
}

variable "IMAGE_TAG" {
    default = null
}

variable "GITHUB_CI" {
  default = "-DGITHUB_CI=false"
}

dynamic "variable" {
   for_each = try(env("GITHUB_CI"), "") != "" ? [1] : []
   content {
     name = "GITHUB_CI"
     value = env("GITHUB_CI")
   }
}

dynamic "assert" {
  for_each = var.IMAGE_TAG == null ? [1] : []
  content {
    condition     = false
    error_message = "IMAGE_TAG 必须设置（通过 --set IMAGE_TAG=xxx 或环境变量）"
  }
}

target "great-wall-bootJar" {
  context = "."
  dockerfile = "Dockerfile"
  platforms = ["linux/amd64", "linux/arm64"]
  args = {
      GITHUB_CI = "${GITHUB_CI}"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}_bootJar"]
}

target "great-wall" {
  context = "."
  dockerfile = "Dockerfile.native"
  platforms = ["linux/amd64", "linux/arm64"]
  args = {
      GITHUB_CI = "${GITHUB_CI}"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}","${IMAGE_REGISTRY}/moailaozi/great-wall:latest"]
}

target "great-wall-g1gc" {
  context = "."
  dockerfile = "Dockerfile.native"
  platforms = ["linux/amd64", "linux/arm64"]
  args = {
     g1gc = "-Pgl.enable=true"
     GITHUB_CI = "${GITHUB_CI}"
     greatWallMaxMemory = "1g"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}_g1gc"]
}