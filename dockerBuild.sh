version=$1

# 构建
docker build -t great-wall:"$version" -f Dockerfile.native . || exit

# 上传
docker tag great-wall:"$version" moailaozi/great-wall:"$version"
docker push moailaozi/great-wall:"$version"

docker tag great-wall:"$version" moailaozi/great-wall:latest
docker push moailaozi/great-wall:latest