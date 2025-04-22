group "default" {
  targets = ["great-wall-bootJar", "great-wall", "great-wall-g1gc"]
}

variable "IMAGE_REGISTRY" {
  default = "docker.io"
}

variable "IMAGE_TAG" {
   default = ""

  validation {
    condition = IMAGE_TAG != ""
    error_message = "IMAGE_TAG 必须设置环境变量"
  }
}

variable "GITHUB_CI" {
  default = "-DGITHUB_CI=false"
}

variable "CACHE_DIR" {
  default = "./.buildx-cache"
}

target "default" {
  cache-from = ["type=local,src=${CACHE_DIR}"]
  cache-to = ["type=local,dest=${CACHE_DIR}-new,mode=max"]
}

target "great-wall-bootJar" {
  inherits = ["default"]
  context = "."
  dockerfile = "Dockerfile"
  platforms = ["linux/amd64", "linux/arm64"]
  args = {
      GITHUB_CI = "${GITHUB_CI}"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}_bootJar", "${IMAGE_REGISTRY}/moailaozi/great-wall:bootJar"]
}

target "great-wall" {
  inherits = ["default"]
  context = "."
  dockerfile = "Dockerfile.native"
  platforms = ["linux/amd64", "linux/arm64"]
  args = {
      GITHUB_CI = "${GITHUB_CI}"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}", "${IMAGE_REGISTRY}/moailaozi/great-wall:latest"]
}

target "great-wall-g1gc" {
  inherits = ["default"]
  context = "."
  dockerfile = "Dockerfile.native"
  platforms = ["linux/amd64", "linux/arm64"]
  args = {
     g1gc = "-Pgl.enable=true"
     GITHUB_CI = "${GITHUB_CI}"
     greatWallMaxMemory = "1g"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}_g1gc", "${IMAGE_REGISTRY}/moailaozi/great-wall:g1gc"]
}