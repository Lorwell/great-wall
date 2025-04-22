FROM moailaozi/great-wall:build_base_image AS builder

SHELL ["/bin/bash", "-c"]

# 复制项目所有代码
COPY . /build
WORKDIR /build

RUN cd /build/great-wall-fe \
    && source $NVM_DIR/nvm.sh  \
    && pnpm i \
    && pnpm run build \
    && echo "前端构建完成"  \
    && cd /build \
    && source "/root/.sdkman/bin/sdkman-init.sh" \
    && ./gradlew clean bootJar -x test \
    && echo "后端构建完成"

FROM moailaozi/jre:21_ubuntu22

# 复制构建时镜像的构建结果
WORKDIR /workspace
COPY --from=builder /build/great-wall-server/build/libs/great-wall-server-*.jar /workspace/app.jar

EXPOSE 8080

ARG greatWallMaxMemory=1G
ENV GREAT_WALL_MAX_MEMORY=${greatWallMaxMemory}

CMD [ "bash", "-c", "source /etc/profile && java -Xms$GREAT_WALL_MAX_MEMORY -Xmx$GREAT_WALL_MAX_MEMORY -jar /workspace/app.jar -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8"]