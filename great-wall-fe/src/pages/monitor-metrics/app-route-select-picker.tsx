import useApiRequest from "@/components/hooks/use-api-request.ts";
import {appRouteList} from "@/constant/api/app-routes";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useControllableValue} from "ahooks";

export interface AppRouteSelectPickerProps {

  /**
   * -1 表示全部
   */
  value: number | -1

  onChange?: (value: number | -1) => void
}

/**
 * 应用路由选择器
 * @param props
 * @constructor
 */
export default function AppRouteSelectPicker(props: AppRouteSelectPickerProps) {

  const [value, onChange] = useControllableValue(props, {defaultValue: -1});

  const {
    data,
  } = useApiRequest(() => appRouteList({current: -1}));

  return (
    <Select value={`${value}`}
            onValueChange={it => onChange?.(Number(it))}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder={"选择应用路由"}/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"-1"}>
          全部应用
        </SelectItem>
        {
          data?.records?.map((it) => {
            return (
              <SelectItem key={it.id} value={`${it.id}`}>
                {it.name}
              </SelectItem>
            )
          })
        }
      </SelectContent>
    </Select>
  )
}