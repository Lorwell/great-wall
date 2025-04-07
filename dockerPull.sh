version=2.31

bootJarVersion="$version"_bootJar
defaultVersion="$version"
g1gcVersion="$version"_g1gc

# ----------- 构建
# 构建前端
cd great-wall-fe && pnpm i && pnpm run build && cd .. || exit
# 构建 bootJar
./gradlew clean bootJar || exit 1
docker build -t great-wall:"$bootJarVersion" -f Dockerfile . || exit 1
# 构建 default
docker build -t great-wall:"$defaultVersion" -f Dockerfile.native . || exit 1
# 构建g1gc版本
docker build --build-arg g1gc="-Pgl.enable=true" --build-arg greatWallMaxMemory="1g" -t great-wall:"$g1gcVersion" -f Dockerfile.native . || exit 1

# ----------- 上传

docker tag great-wall:$bootJarVersion moailaozi/great-wall:$bootJarVersion
docker push moailaozi/great-wall:$bootJarVersion || exit 1

docker tag great-wall:$defaultVersion moailaozi/great-wall:$defaultVersion
docker push moailaozi/great-wall:$defaultVersion || exit 1

docker tag great-wall:$defaultVersion moailaozi/great-wall:latest
docker push moailaozi/great-wall:latest || exit 1

docker tag great-wall:$g1gcVersion moailaozi/great-wall:$g1gcVersion
docker push moailaozi/great-wall:$g1gcVersion || exit 1
