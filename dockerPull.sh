version=1.25

# 构建前端
cd great-wall-fe && pnpm run build && cd .. || exit

# 构建
docker build -t great-wall:"$version" -f Dockerfile.native . || exit

# 上传
docker tag great-wall:"$version" ccr.ccs.tencentyun.com/shaco_work/great-wall:"$version"
docker push ccr.ccs.tencentyun.com/shaco_work/great-wall:"$version"

docker tag great-wall:"$version" ccr.ccs.tencentyun.com/shaco_work/great-wall:latest
docker push ccr.ccs.tencentyun.com/shaco_work/great-wall:latest

# 删除上传成功
docker rmi ccr.ccs.tencentyun.com/shaco_work/great-wall:latest
docker rmi ccr.ccs.tencentyun.com/shaco_work/great-wall:"$version"
