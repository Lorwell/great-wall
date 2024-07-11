FROM ccr.ccs.tencentyun.com/shaco_work/jre:21_ubuntu22

WORKDIR /workspace

COPY great-wall-server/build/libs/great-wall-server-1.0.jar /workspace/app.jar

EXPOSE 443
EXPOSE 8080
EXPOSE 9000

CMD [ "sh", "-c", "java -jar /workspace/app.jar -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8"]