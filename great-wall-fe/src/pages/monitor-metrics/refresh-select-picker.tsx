import {Button} from "@/components/ui/button.tsx";
import {RefreshCcw} from "lucide-react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useEffect, useState} from "react";
import {useInterval, useLockFn} from "ahooks";

export interface RefreshSelectPickerProps {

  onRefresh?: () => Promise<void> | void;

}

/**
 * 刷新选择器
 */
export default function RefreshSelectPicker(props: RefreshSelectPickerProps) {
  const {onRefresh} = props
  const [interval, setInterval] = useState<number>(10);

  const clear = useInterval(() => {
    onRefresh?.()
  }, interval * 1000);

  useEffect(() => {
    return clear
  }, []);

  const handleRefresh = useLockFn(async () => {
    await onRefresh?.()
  });

  function handleSelectChange(value: string) {
    setInterval(parseInt(value));
  }

  return (
    <div className={"flex flex-row rounded-md border border-input"}>
      <Button variant={"outline"} className={"border-none"} onClick={handleRefresh}>
        <RefreshCcw className="h-4 w-4"/>
      </Button>
      <Separator orientation="vertical"/>
      <Select defaultValue={"10"} value={String(interval)} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[70px] border-none">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="5">5s</SelectItem>
            <SelectItem value="10">10s</SelectItem>
            <SelectItem value="30">30s</SelectItem>
            <SelectItem value="60">1m</SelectItem>
            <SelectItem value="300">5m</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}