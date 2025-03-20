import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useNavigate, useParams} from "react-router-dom";
import {CSSProperties, useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {downloadFile, isBlank, isEmpty} from "@/lib/utils.ts";
import {Label} from "@/components/ui/label.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import AutoSizablePanel from "@/components/custom-ui/auto-sizable-panel.tsx";

import {Dot, FileDown} from "lucide-react";
import {LazyLog, ScrollFollow} from "@melloware/react-logviewer";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {logsList} from "@/constant/api/app-logs";
import {logTypeChinese} from "@/constant/api/app-logs/types.ts";
import {Button} from "@/components/ui/button.tsx";

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
 *
 * 组件： https://github.com/melloware/react-logviewer
 * @constructor
 */
export default function LogFile() {
  const {type, file} = useParams();
  const navigate = useNavigate();

  if (isBlank(type) || isBlank(file)) {
    toast.error("错误的路径参数", {
      position: "top-right",
      duration: 3000
    })
    window.history.back()
  }

  const {data, loading} = useApiRequest(logsList);

  // 操作相关
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // websocket 相关
  const wsRef = useRef<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<ReadyState>(ReadyState.Connecting);

  // 刷新
  useEffect(() => {
    wsRef.current?.send(JSON.stringify({autoRefresh}))
  }, [autoRefresh]);

  /**
   * 导航到新的日志文件
   */
  function navigateLogFile(logFile: string) {
    const index = logFile.indexOf("-")
    const type = logFile.substring(0, index)
    const file = logFile.substring(index + 1)
    navigate(`/manage/logs/type/${type.toLowerCase()}/file/${file}`)
  }

  /**
   * 下载日志
   */
  function handleDownload() {
    downloadFile(file!, `/api/logs/type/${type?.toUpperCase()}/name/${file}/download`)
  }

  const host = `${window.location.host}`;
  const openTLS = 'https:' === window.location.protocol;
  const url = `${openTLS ? 'wss' : 'ws'}://${host}/api/logs/type/${type}/name/${file}`

  return (
    <AutoSizablePanel className={"w-full h-full overflow-hidden"}>
      {
        (size) => (
          <div className={"flex flex-col space-y-4"} style={{...size}}>

            <div className={"flex flex-row justify-between"}>
              <div className={"flex flex-row items-center space-x-3"}>

                <Select disabled={loading || isEmpty(data?.records)}
                        value={`${type!!.toUpperCase()}-${file}`}
                        onValueChange={it => navigateLogFile(it)}
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {
                      data?.records?.map((it) => {
                        const value = `${it.type}-${it.name}`
                        return (
                          <SelectItem key={`${it.type}-${it.name}`} value={value}>
                            {logTypeChinese(it.type)} - {it.name}
                          </SelectItem>
                        )
                      })
                    }
                  </SelectContent>
                </Select>

                <div className={"flex flex-row items-center space-x-1"}>
                  <Checkbox id={"autoRefresh"}
                            checked={autoRefresh}
                            onCheckedChange={(value) => setAutoRefresh(typeof value === "boolean" ? value : false)}
                  />
                  <Label htmlFor="autoRefresh">自动追踪日志</Label>
                </div>

              </div>

              <div className={"flex flex-row items-center space-x-4"}>

                <div className={"flex flex-row items-center space-x-2"}>
                  <Dot className={"rounded"} style={{...statusStyles[readyState.toLowerCase()]}}/>
                  <span style={{...statusStyles[readyState.toLowerCase()]}}>
                    {readyState === ReadyState.Connecting && "连接中"}
                    {readyState === ReadyState.Open && "已连接"}
                    {readyState === ReadyState.Closed && "断开"}
                  </span>
                </div>

                <Button variant={"secondary"} onClick={handleDownload}>
                  <FileDown className={"mr-2 h-4 w-4"}/>
                  下载日志
                </Button>
              </div>
            </div>

            <div className={"flex-auto"}>
              <ScrollFollow startFollowing={true}
                            render={({follow, onScroll}) => (
                              <LazyLog follow={follow}
                                       onScroll={onScroll}
                                       caseInsensitive
                                       enableHotKeys
                                       enableLinks
                                       enableMultilineHighlight
                                       enableSearch
                                       enableSearchNavigation
                                       selectableLines
                                       enableLineNumbers
                                       url={url}
                                       websocket
                                       websocketOptions={{
                                         onOpen: (__, sock) => {
                                           setReadyState(ReadyState.Open)
                                           wsRef.current = sock
                                           sock.send(JSON.stringify({autoRefresh}))
                                         },
                                         onClose: (e) => {
                                           console.error(`日志链接 ${url} 断开`, e)
                                           setReadyState(ReadyState.Closed)
                                         },
                                         // @ts-ignore
                                         formatMessage: (message: string) => {
                                           if (message === "PING") {
                                             wsRef.current?.send("PONG")
                                             return null
                                           } else {
                                             return JSON.parse(message).join("\n")
                                           }
                                         }
                                       }}
                              />
                            )}
              />
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
