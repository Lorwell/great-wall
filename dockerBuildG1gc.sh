version="$1_g1gc"

# 构建
docker build --build-arg g1gc="-Pgl.enable=true" --build-arg greatWallMaxMemory="1g" -t great-wall:"$version" -f Dockerfile.native . || exit

# 上传
docker tag great-wall:"$version" moailaozi/great-wall:"$version"
docker push moailaozi/great-wall:"$version"