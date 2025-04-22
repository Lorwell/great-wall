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

target "great-wall-bootJar" {
  context = "."
  dockerfile = "Dockerfile"
  platforms = ["linux/amd64", "linux/arm64"]
  args = {
      GITHUB_CI = "${GITHUB_CI}"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}_bootJar", "${IMAGE_REGISTRY}/moailaozi/great-wall:bootJar"]
  cache-from = ["type=local,src=/tmp/.buildx-cache"]
  cache-to = ["type=local,dest=/tmp/.buildx-cache-new,mode=max"]
}

target "great-wall" {
  context = "."
  dockerfile = "Dockerfile.native"
  platforms = ["linux/amd64", "linux/arm64"]
  args = {
      GITHUB_CI = "${GITHUB_CI}"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}", "${IMAGE_REGISTRY}/moailaozi/great-wall:latest"]
  cache-from = ["type=local,src=/tmp/.buildx-cache"]
  cache-to = ["type=local,dest=/tmp/.buildx-cache-new,mode=max"]
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
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}_g1gc", "${IMAGE_REGISTRY}/moailaozi/great-wall:g1gc"]
  cache-from = ["type=local,src=/tmp/.buildx-cache"]
  cache-to = ["type=local,dest=/tmp/.buildx-cache-new,mode=max"]
}