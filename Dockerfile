FROM ccr.ccs.tencentyun.com/shaco_work/jre:21_ubuntu22

# 复制构建时镜像的构建结果
WORKDIR /workspace
COPY great-wall-server/build/libs/great-wall-server-*.jar /workspace/app.jar

EXPOSE 8080

ARG greatWallMaxMemory=1G
ENV GREAT_WALL_MAX_MEMORY=${greatWallMaxMemory}

CMD [ "bash", "-c", "source /etc/profile && java -Xms$GREAT_WALL_MAX_MEMORY -Xmx$GREAT_WALL_MAX_MEMORY -jar /workspace/app.jar -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8"]