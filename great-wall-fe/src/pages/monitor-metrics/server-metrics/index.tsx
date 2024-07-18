import UpTimeMetrics from "./up-time-metrics.tsx";
import NonHeadMemoryMetrics from "./non-head-memory-metrics.tsx";
import HeadMemoryMetrics from "./head-memory-metrics.tsx";
import DirectMemoryMetrics from "./direct-memory-metrics.tsx";
import ProcessCpuMetrics from "./process-cpu-metrics.tsx";
import ThreadTotalMetrics from "./thread-total-metrics.tsx";
import MemoryLineChart from "./memory-line-chart.tsx";
import {
  directMemoryLineMetrics,
  gcCountLineMetrics,
  gcTimeLineMetrics,
  headMemoryLineMetrics,
  nonHeadMemoryLineMetrics
} from "@/constant/api/monitor-metrics/system-metrics";
import CpuLineChart from "./cpu-line-chart.tsx";
import ThreadLineChart from "./thread-line-chart";
import LoadedClassLineChart from "./loaded-class-line-chart.tsx";
import GcLineChart from "@/pages/monitor-metrics/server-metrics/gc-line-chart.tsx";

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
      <div className="grid gap-4 grid-cols-1">
        <CpuLineChart/>
      </div>
      <div className="grid gap-4 grid-cols-3">
        <MemoryLineChart title={"堆内存"} service={headMemoryLineMetrics}/>
        <MemoryLineChart title={"非堆内存"} service={nonHeadMemoryLineMetrics}/>
        <MemoryLineChart title={"直接内存"} service={directMemoryLineMetrics}/>
      </div>

      <div className={"grid gap-4 grid-cols-2"}>
        <ThreadLineChart/>
        <LoadedClassLineChart/>
      </div>

      <div className={"grid gap-4 grid-cols-2"}>
        <GcLineChart title={"GC 次数"} service={gcCountLineMetrics}/>
        <GcLineChart title={"GC 时间"} service={gcTimeLineMetrics} tickFormatter={value => `${value}ms`}/>
      </div>
    </div>
  )
}