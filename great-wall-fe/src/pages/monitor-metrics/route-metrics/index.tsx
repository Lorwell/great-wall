import RequestCountMetrics from "@/pages/monitor-metrics/route-metrics/request-count-metrics.tsx";
import AverageResponseTimeMetrics from "@/pages/monitor-metrics/route-metrics/average-response-time-metrics.tsx";
import ErrorResponseCountMetrics from "@/pages/monitor-metrics/route-metrics/error-response-count-metrics.tsx";
import MaxResponseTimeMetrics from "@/pages/monitor-metrics/route-metrics/max-response-time-metrics.tsx";
import QpsLineChart from "@/pages/monitor-metrics/route-metrics/qps-line-chart.tsx";
import ResponseDurationTimeLineChart from "@/pages/monitor-metrics/route-metrics/response-duration-time-line-chart.tsx";
import TopApiQpsLineChart from "@/pages/monitor-metrics/route-metrics/top-api-qps-line-chart.tsx";

/**
 * 路由指标
 * @constructor
 */
export default function RouteMetrics() {
  return (
    <div className={"w-full h-full space-y-4"}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RequestCountMetrics/>
        <ErrorResponseCountMetrics/>
        <AverageResponseTimeMetrics/>
        <MaxResponseTimeMetrics/>
      </div>
      <div className="grid gap-4 grid-cols-2">
        <QpsLineChart/>
        <ResponseDurationTimeLineChart/>
      </div>

      <div className={"grid grid-cols-1"}>
        <TopApiQpsLineChart/>
      </div>
    </div>
  )
}