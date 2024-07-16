import TopApiQpsLineChart from "@/pages/monitor-metrics/route-metrics/top-api-qps-line-chart.tsx";
import UpTimeMetrics from "@/pages/monitor-metrics/server-metrics/up-time-metrics.tsx";
import NonHeadMemoryMetrics from "@/pages/monitor-metrics/server-metrics/non-head-memory-metrics.tsx";
import HeadMemoryMetrics from "@/pages/monitor-metrics/server-metrics/head-memory-metrics.tsx";
import DirectMemoryMetrics from "@/pages/monitor-metrics/server-metrics/direct-memory-metrics.tsx";
import ProcessCpuMetrics from "@/pages/monitor-metrics/server-metrics/process-cpu-metrics.tsx";
import ThreadTotalMetrics from "@/pages/monitor-metrics/server-metrics/thread-total-metrics.tsx";
import HeadMemoryLineChart from "@/pages/monitor-metrics/server-metrics/head-memory-line-chart.tsx";
import NonHeadMemoryLineChart from "@/pages/monitor-metrics/server-metrics/non-head-memory-line-chart.tsx";
import DirectHeadMemoryLineChart from "@/pages/monitor-metrics/server-metrics/direct-head-memory-line-chart.tsx";

/**
 * 服务指标
 * @constructor
 */
export default function ServerMetrics() {
  return (
    <div className={"w-full h-full space-y-4"}>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <UpTimeMetrics/>
        <ProcessCpuMetrics/>
        <HeadMemoryMetrics/>
        <NonHeadMemoryMetrics/>
        <DirectMemoryMetrics/>
        <ThreadTotalMetrics/>
      </div>
      <div className="grid gap-4 grid-cols-3">
        <HeadMemoryLineChart/>
        <NonHeadMemoryLineChart/>
        <DirectHeadMemoryLineChart/>
      </div>

      <div className={"grid grid-cols-1"}>
        <TopApiQpsLineChart/>
      </div>
    </div>
  )
}