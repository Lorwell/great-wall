FROM ccr.ccs.tencentyun.com/shaco_work/graalvm21:ubuntu22.build

# 复制项目所有代码
ADD . /build
WORKDIR /build

# 执行编译
RUN bash -c "source /etc/profile && dos2unix /build/gradlew && /build/gradlew nativeCompile"


# 运行时镜像
FROM ccr.ccs.tencentyun.com/shaco_work/graalvm21:ubuntu22.runtime

WORKDIR /workspace
COPY --from=0 "/build/great-wall-server/build/native/nativeCompile/great-wall-server" /workspace/app

EXPOSE 443

CMD [ "sh", "-c", "/workspace/app -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8"]