version='last'

# 构建前端
cd great-wall-fe && pnpm run build && cd .. || exit

# 构建
docker build -t great-wall:"$version" -f Dockerfile.native . || exit
