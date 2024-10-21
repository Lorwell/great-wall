import RequestCountMetrics from "./request-count-metrics.tsx";
import AccessIpCountMetrics from "./access-ip-count-metrics.tsx";
import Response5xxErrorCountMetrics from "./response5xx-error-count-metrics.tsx";
import RequestTrafficMetrics from "./request-traffic-metrics.tsx";
import QpsLineChart from "./qps-line-chart.tsx";
import ResponseDurationTimeLineChart from "./response-duration-time-line-chart.tsx";
import Response4xxErrorCountMetrics from "./response4xx-error-count-metrics.tsx";
import ResponseTrafficMetrics from "@/pages/monitor-metrics/route-metrics/response-traffic-metrics.tsx";
import TrafficTimeLineChart from "./traffic-time-line-chart.tsx";

/**
 * 路由指标
 * @constructor
 */
export default function RouteMetrics() {

  return (
    <div className={"w-full h-full space-y-4"}>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <RequestCountMetrics/>
        <AccessIpCountMetrics/>
        <RequestTrafficMetrics/>
        <ResponseTrafficMetrics/>
        <Response4xxErrorCountMetrics/>
        <Response5xxErrorCountMetrics/>
      </div>
      <div className="grid gap-4 grid-cols-2">
        <QpsLineChart/>
        <ResponseDurationTimeLineChart/>
      </div>

      <div className={"grid grid-cols-1"}>
        <TrafficTimeLineChart/>
      </div>
    </div>
  )
}