import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import Charts from "@/components/custom-ui/charts.tsx";

const options = {
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    right: '15%',
    bottom: '10%'
  },
  toolbox: {
    right: 10,
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    },
    {
      data: [1, 932, 21, 934, 12, 21, 121],
      type: 'line',
      smooth: true
    }
  ]
}

/**
 * 请求量前 n 的api qps 折线图
 * @constructor
 */
export default function TopApiQpsLineChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Top API QPS
        </CardTitle>
        <Spinner className={"w-4 h-4"}/>
      </CardHeader>
      <CardContent>
        <Charts option={options}/>
      </CardContent>
    </Card>
  )
}