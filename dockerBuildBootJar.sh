version="$1_bootJar"

# 构建
./gradlew clean bootJar || exec
docker build -t great-wall:"$version" -f Dockerfile . || exit

# 上传
docker tag great-wall:"$version" moailaozi/great-wall:"$version"
docker push moailaozi/great-wall:"$version"