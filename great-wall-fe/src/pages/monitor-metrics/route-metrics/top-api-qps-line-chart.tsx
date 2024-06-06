import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import Charts from "@/components/custom-ui/charts.tsx";

const options = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['接口1', '接口2', '接口3'],
    type: 'scroll',
    orient: 'vertical',
    right: 10,
    top: 20,
    bottom: 20,
    selectedMode: 'multiple'
  },
  grid: {
    top: "30",
    left: '50',
    right: '120',
    bottom: '30',
  },
  xAxis: {
    type: 'category',
    data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '接口1',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210, 130, 220, 182, 191, 234, 290, 330, 310, 120, 101, 134, 90, 230, 210, 130, 220, 182, 191, 234, 290, 330, 330, 310]
    },
    {
      name: '接口2',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310, 120, 132, 101, 134, 90, 230, 210, 130, 220, 182, 191, 234, 290, 330, 330, 310, 120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '接口3',
      type: 'line',
      data: [150, 232, 201, 154, 190, 330, 410, 370, 322, 361, 251, 153, 125, 122, 133, 124, 145, 122, 132, 134, 150, 232, 201, 154, 190, 330, 410, 370, 322]
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
        <Charts style={{height: 280}} option={options}/>
      </CardContent>
    </Card>
  )
}