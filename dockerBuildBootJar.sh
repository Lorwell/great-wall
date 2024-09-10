version="$1_bootJar"

gradlew clean bootJar || exec

# 构建
docker build -t great-wall:"$version" -f Dockerfile . || exit

# 上传
docker tag great-wall:"$version" ccr.ccs.tencentyun.com/shaco_work/great-wall:"$version"
docker push ccr.ccs.tencentyun.com/shaco_work/great-wall:"$version"

# 删除上传成功
docker rmi ccr.ccs.tencentyun.com/shaco_work/great-wall:"$version"