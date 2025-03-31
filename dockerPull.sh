version=2.29

# 构建前端
#cd great-wall-fe && pnpm i && pnpm run build && cd .. || exit

# 构建 bootJar
#bash dockerBuildBootJar.sh $version  || exit

# 构建
bash dockerBuild.sh $version  || exit

# 构建g1gc版本
bash dockerBuildG1gc.sh $version  || exit