import {EChartsReactProps} from "echarts-for-react/src/types.ts";
import ReactECharts from "echarts-for-react";
import {useTheme} from "@/components/theme-provider.tsx";
import {forwardRef, Ref} from "react";

export interface ChartsProps extends Omit<EChartsReactProps, "theme"> {

}

/**
 * 图表，基于 echarts-for-react
 * @param props
 * @constructor
 */
const Charts = forwardRef((props: ChartsProps, ref: Ref<any>) => {
  const {opts, ...rest} = props;
  const {rawTheme} = useTheme();

  return (
    <ReactECharts {...rest} ref={ref} theme={rawTheme} opts={{renderer: "svg", locale: "zh", ...opts}}/>
  )
})

export default Charts