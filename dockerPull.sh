#!/bin/bash

set -e

# 颜色定义（用于日志高亮）
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1" >&2
}

# 构建前端
build_frontend() {
  log_success "开始构建前端..."
  source ~/.nvm/nvm.sh && nvm install || { log_error "加载 nvm 失败"; exit 1; }
  cd great-wall-fe || { log_error "进入前端目录失败"; exit 1; }
  pnpm i || { log_error "前端依赖安装失败"; exit 1; }
  pnpm run build || { log_error "前端构建失败"; exit 1; }
  cd ..
  log_success "前端构建完成"
}

# 构建后端
build_backend() {
  log_success "开始构建后端..."
  source ~/.sdkman/bin/sdkman-init.sh && sdk env || { echo "加载 SDKMAN! 失败"; exit 1; }
  ./gradlew clean bootJar -x test --no-daemon || { log_error "后端构建失败"; exit 1; }
  log_success "后端构建完成"
}

# Docker构建
build_docker() {
  log_success "开始Docker构建..."
#  docker buildx bake -f docker-bake.hcl great-wall-bootJar --push || { log_error "Docker构建 great-wall-bootJar 失败"; exit 1; }
  docker buildx bake -f docker-bake.hcl great-wall --push || { log_error "Docker构建 great-wall 失败"; exit 1; }
  docker buildx bake -f docker-bake.hcl great-wall-g1gc --push || { log_error "Docker构建 great-wall-g1gc 失败"; exit 1; }
  log_success "Docker构建完成"
}

main() {
#  build_frontend
#  build_backend
  build_docker

  log_success "========== 全部构建成功 =========="
}

# 执行主函数
main "$@"

#version=2.31
#
#bootJarVersion="$version"_bootJar
#defaultVersion="$version"
#g1gcVersion="$version"_g1gc
#
## ----------- 构建
## 构建前端
#cd great-wall-fe && pnpm i && pnpm run build && cd .. || exit
## 构建 bootJar
#./gradlew clean bootJar || exit 1
#docker build -t great-wall:"$bootJarVersion" -f Dockerfile . || exit 1
## 构建 default
#docker build -t great-wall:"$defaultVersion" -f Dockerfile.native . || exit 1
## 构建g1gc版本
#docker build --build-arg g1gc="-Pgl.enable=true" --build-arg greatWallMaxMemory="1g" -t great-wall:"$g1gcVersion" -f Dockerfile.native . || exit 1
#
## ----------- 上传
#
#docker tag great-wall:$bootJarVersion moailaozi/great-wall:$bootJarVersion
#docker push moailaozi/great-wall:$bootJarVersion || exit 1
#
#docker tag great-wall:$defaultVersion moailaozi/great-wall:$defaultVersion
#docker push moailaozi/great-wall:$defaultVersion || exit 1
#
#docker tag great-wall:$defaultVersion moailaozi/great-wall:latest
#docker push moailaozi/great-wall:latest || exit 1
#
#docker tag great-wall:$g1gcVersion moailaozi/great-wall:$g1gcVersion
#docker push moailaozi/great-wall:$g1gcVersion || exit 1
