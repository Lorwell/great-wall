import {EChartsReactProps} from "echarts-for-react/src/types.ts";
import ReactECharts from "echarts-for-react";
import {useTheme} from "@/components/theme-provider.tsx";

export interface ChartsProps extends Omit<EChartsReactProps, "theme"> {

}

/**
 * 图表，基于 echarts-for-react
 * @param props
 * @constructor
 */
export default function Charts(props: ChartsProps) {
  const {opts, ...rest} = props;
  const {rawTheme} = useTheme();

  return (
    <ReactECharts {...rest} theme={rawTheme} opts={{renderer: "svg", locale: "zh", ...opts}}/>
  )
}