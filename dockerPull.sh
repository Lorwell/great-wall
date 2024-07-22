version=2.4

# 构建前端
cd great-wall-fe && pnpm run build && cd .. || exit

# 构建
bash dockerBuild.sh

# 构建g1gc版本
bash dockerBuildG1gc.sh $version


