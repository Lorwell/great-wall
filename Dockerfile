FROM ubuntu:22.04

# 设置为 阿里云的源
RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list; \
    sed -i s@/security.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list; \
    apt-get clean; \
    apt-get update;

# 安装常用命令
RUN apt-get install -y curl unzip zip wget tar less vim dos2unix

# 安装 graalvm 需要的依赖
RUN apt-get install -y build-essential libz-dev zlib1g-dev

# 设置编码
RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
	&& localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG en_US.utf8
ENV LANGUAGE en_US.utf8
ENV LC_ALL en_US.utf8

# 安装jdks
ADD ./jdks /jdks

RUN tar -zvxf /jdks/graalvm-community-jdk-21.0.1_linux-x64_bin.tar.gz -C /jdks; \
    mv -f /jdks/graalvm-community-openjdk-21.0.1+12.1 /jdks/graalvm21

RUN echo "export JAVA_HOME=/jdks/graalvm21" >> /etc/profile; \
    echo "export PATH=/jdks/graalvm21/bin:$PATH" >> /etc/profile;

RUN bash -c "source /etc/profile && java -version"

# 复制项目所有代码
ADD . /build
WORKDIR /build

# 执行编译
RUN bash -c "source /etc/profile && dos2unix /build/gradlew && /build/gradlew nativeCompile"


# 运行时镜像
FROM ubuntu:22.04

RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list; \
    sed -i s@/security.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list; \
    apt-get clean; \
    apt-get update;

RUN apt-get install -y curl unzip zip wget tar less vim

RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
	&& localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG en_US.utf8
ENV LANGUAGE en_US.utf8
ENV LC_ALL en_US.utf8

WORKDIR /workspace
COPY --from=0 "/build/great-wall-server/build/native/nativeCompile/great-wall-server" /workspace/app

EXPOSE 443

CMD [ "sh", "-c", "/workspace/app -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8"]