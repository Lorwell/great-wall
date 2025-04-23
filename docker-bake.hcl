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

variable "TAG_PLATFORM" {
  default = ""
}

target "great-wall-bootJar" {
  context = "."
  dockerfile = "Dockerfile"
  args = {
      GITHUB_CI = "${GITHUB_CI}"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}_bootJar${TAG_PLATFORM}", "${IMAGE_REGISTRY}/moailaozi/great-wall:bootJar${TAG_PLATFORM}"]
}

target "great-wall" {
  context = "."
  dockerfile = "Dockerfile.native"
  args = {
      GITHUB_CI = "${GITHUB_CI}"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}${TAG_PLATFORM}"]
}

target "great-wall-g1gc" {
  context = "."
  dockerfile = "Dockerfile.native"
  args = {
     g1gc = "-Pgl.enable=true"
     GITHUB_CI = "${GITHUB_CI}"
     greatWallMaxMemory = "1g"
  }
  tags = ["${IMAGE_REGISTRY}/moailaozi/great-wall:${IMAGE_TAG}_g1gc${TAG_PLATFORM}", "${IMAGE_REGISTRY}/moailaozi/great-wall:g1gc${TAG_PLATFORM}"]
}