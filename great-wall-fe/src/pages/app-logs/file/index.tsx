import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useParams} from "react-router-dom";
import {CSSProperties, useEffect, useId, useRef, useState} from "react";
import {LogTypeEnum} from "@/constant/api/app-logs/types.ts";
import {toast} from "sonner";
import {isBlank, isNull} from "@/utils/Utils.ts";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useMemoizedFn} from "ahooks";
import AutoSizablePanel from "@/components/custom-ui/auto-sizable-panel.tsx";

import "./styles.less"
import {Dot} from "lucide-react";

export enum ReadyState {
  Connecting = "CONNECTING",
  Open = "OPEN",
  Closed = "CLOSED"
}

const statusStyles: Record<string, CSSProperties> = {
  open: {
    color: "rgba(74, 167, 133, 1)"
  },
  connecting: {
    color: "rgba(89, 168, 212, 1)"
  },
  closed: {
    color: "rgba(255, 71, 71, 1)"
  }
}

/**
 * 日志文件
 * @constructor
 */
export default function LogFile() {
  const {type, file} = useParams();

  if (isBlank(type) || isBlank(file)) {
    toast.error("错误的路径参数", {
      position: "top-right",
      duration: 3000
    })
    window.history.back()
  }

  const logBodyId = useId();

  const [logType, setLogType] = useState<LogTypeEnum>(type!!.toUpperCase() as LogTypeEnum)

  // 操作相关
  const [lineLimit, setLineLimit] = useState<number>(5000);
  const [lineNumber, setLineNumber] = useState<number>(50);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(3);

  // websocket 相关
  const ws = useRef<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<ReadyState>(ReadyState.Closed);

  // 定时器
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  /**
   * 发送消息
   */
  const sendMessage = useMemoizedFn((data: any) => {
    if (ReadyState.Open === readyState) {
      try {
        ws.current?.send(data)
      } catch (e) {
        console.error(e)
      }
    }
  })

  /**
   * 关闭定时器
   */
  const closeTimeoutId = useMemoizedFn(() => {
    if (!isNull(timeoutId)) {
      clearTimeout(timeoutId);
      setTimeoutId(undefined)
    }
  })

  /**
   * 开启自动刷新数据
   */
  const startAutoRefreshData = useMemoizedFn(() => {
    closeTimeoutId();

    if (autoRefresh) {
      // 获取下一页数据
      handleNextPage();

      const timeout = setTimeout(() => {
        startAutoRefreshData()
      }, autoRefreshInterval * 1000);
      setTimeoutId(timeout);
    }
  })

  /**
   * 处理下一页操作
   */
  const handleNextPage = useMemoizedFn(() => {
    sendMessage(JSON.stringify({lineNumber}))
  })

  /**
   * 处理写入日志
   * @param data
   */
  const handleWriteLog = useMemoizedFn((data: LogFilePageOutput) => {
    const logBody = document.getElementById(logBodyId);
    if (isNull(lineNumber) || lineNumber === 0 || isNull(logBody)) return;

    const {lineData, lastLine} = data;

    // 循环写入
    for (let line of lineData) {
      const span = document.createElement("span");
      span.className = "log-line"
      span.innerHTML = line
      logBody!.appendChild(span);

      const br = document.createElement("br");
      logBody!.appendChild(br);
    }

    // 超出长度限制的话从头部删除
    const children = logBody!.children;
    const length = children.length;
    if (length > lineLimit) {
      const number = length - lineLimit;
      for (let i = 0; i < number; i++) {
        children[i].remove();
      }
    }

    // 设置滚动条到最底部
    logBody!.scrollTop = logBody!.scrollHeight;

    // 如果日志没有读取到最后一行则立即刷新
    if (!lastLine) {
      startAutoRefreshData();
    }
  })

  /**
   * 处理 socket 打开事件
   */
  const handleOpen = useMemoizedFn((__: Event) => {
    setReadyState(ReadyState.Open);

    console.log("链接打开...")

    const logBody = document.getElementById(logBodyId);
    if (!!logBody) {
      logBody.innerHTML = ""
    }

    startAutoRefreshData();
  })

  /**
   * 处理 socket 收到消息事件事件
   */
  const handleMessage = useMemoizedFn((event: MessageEvent) => {
    setReadyState(ReadyState.Open);

    // 心跳消息返回
    if ("PING" === event.data) {
      console.log(new Date(), "收到心跳消息...");
      sendMessage("PONG")
      return;
    }

    const data = JSON.parse(event.data);
    handleWriteLog(data)
  })

  /**
   * 处理 socket 错误事件
   */
  const handleError = useMemoizedFn((event: Event) => {
    console.error("链接发送错误", event)
  })

  /**
   * 处理 socket 关闭事件
   */
  const handleClose = useMemoizedFn((__: CloseEvent) => {
    console.log("链接关闭...")

    setReadyState(ReadyState.Closed);
    closeTimeoutId();
  })

  /**
   * 重新建立链接
   */
  const reconnect = useMemoizedFn(() => {
    ws.current?.close();

    console.log(`开始建立日志文件链接 ${type} - ${file}`)

    setReadyState(ReadyState.Connecting);

    // websocket
    const host = `${window.location.host}`;
    const openTLS = 'https:' === window.location.protocol;
    const webSocket = new WebSocket(
      `${openTLS ? 'wss' : 'ws'}://${host}/api/logs/type/${type}/name/${file}`
    );

    webSocket.onopen = handleOpen
    webSocket.onmessage = handleMessage
    webSocket.onerror = handleError
    webSocket.onclose = handleClose

    ws.current = webSocket;
  })

  /**
   * 关闭链接
   */
  const closeConnect = useMemoizedFn(() => {
    closeTimeoutId();
    ws.current?.close()
  });

  // 建立连接
  useEffect(() => {
    reconnect();

    return () => closeConnect();
  }, [])

  // 自动刷新状态变更监听
  useEffect(startAutoRefreshData, [autoRefresh])

  return (
    <AutoSizablePanel className={"w-full h-full overflow-hidden"}>
      {
        (size) => (
          <div className={"flex flex-col space-y-4"} style={{...size}}>

            <div className={"flex flex-row justify-between"}>
              <div className={"flex flex-row items-center space-x-2"}>
                <Select value={logType} onValueChange={it => setLogType(it as LogTypeEnum)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROOT">系统日志</SelectItem>
                    <SelectItem value="ACCESS">访问日志</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={logType} onValueChange={it => setLogType(it as LogTypeEnum)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROOT">系统日志</SelectItem>
                    <SelectItem value="ACCESS">访问日志</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={"flex flex-row items-center space-x-2"}>

                <div className={"flex flex-row items-center space-x-2"}>
                  <Dot className={"rounded"} style={{...statusStyles[readyState.toLowerCase()]}}/>
                  <span style={{...statusStyles[readyState.toLowerCase()]}}>
                    {readyState === ReadyState.Connecting && "连接中"}
                    {readyState === ReadyState.Open && "已连接"}
                    {readyState === ReadyState.Closed && "断开"}
                  </span>
                </div>

              </div>
            </div>

            <div id={logBodyId} className={"flex-auto bg-secondary rounded overflow-y-auto"}>
            </div>

            <div className={"flex flex-row justify-between"}>
              <div className={"flex flex-row items-center space-x-4"}>
                <div className={"flex flex-row items-center space-x-2"}>
                  <Label htmlFor="rowsLimit">日志文件行数限制:</Label>
                  <Input id={"rowsLimit"} type={"number"} className={"w-24"}
                         value={lineLimit}
                         onChange={e => setLineLimit(Number(e.target.value))}
                  />
                </div>
                <div className={"flex flex-row items-center space-x-2"}>
                  <Label htmlFor="lineNumber">每页行数:</Label>
                  <Input id={"lineNumber"} type={"number"} className={"w-24"}
                         value={lineNumber}
                         onChange={e => setLineNumber(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={"flex flex-row items-center space-x-4"}>
                <div className={"flex flex-row items-center space-x-1"}>
                  <Checkbox id={"autoRefresh"}
                            checked={autoRefresh}
                            onCheckedChange={(value) => setAutoRefresh(typeof value === "boolean" ? value : false)}
                  />
                  <Label htmlFor="autoRefresh">自动刷新</Label>
                </div>
                <div className={"flex flex-row items-center space-x-2"}>
                  <Label htmlFor="autoRefreshInterval">自动刷新间隔:</Label>
                  <Input id={"autoRefreshInterval"} type={"number"} className={"w-24"}
                         value={autoRefreshInterval}
                         onChange={e => setAutoRefreshInterval(Number(e.target.value))}
                  />
                </div>
                <div className={"flex flex-row items-center space-x-2"}>
                  <Button variant={"secondary"}>下一页</Button>
                </div>
              </div>

            </div>
          </div>
        )
      }
    </AutoSizablePanel>
  )
}

export interface LogFilePageOutput {

  /**
   * 是否已经达到尾行
   */
  lastLine: boolean

  /**
   * 实际行数
   */
  lineNumber: number

  /**
   * 行数据
   */
  lineData: string[]

}
