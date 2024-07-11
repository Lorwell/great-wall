import {ControllerRenderProps, FieldPath, FieldValues} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {useEffect, useState} from "react";
import {isNull} from "@/utils/Utils.ts";

export interface DurationInputProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
  extends ControllerRenderProps<TFieldValues, TName> {

  /**
   * 默认单位
   */
  defaultUnit?: DurationUnit

}

export enum DurationUnit {
  seconds = "seconds",
  minutes = "minutes",
  hours = "hours",
  days = "days"
}

/**
 * 持续时间输入组件
 *
 *  "PT20.345S" -- parses as "20.345 seconds"
 *  "PT15M"     -- parses as "15 minutes" (where a minute is 60 seconds)
 *  "PT10H"     -- parses as "10 hours" (where an hour is 3600 seconds)
 *  "P2D"       -- parses as "2 days" (where a day is 24 hours or 86400 seconds)
 *
 * @constructor
 */
export default function DurationInput<TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: DurationInputProps<TFieldValues, TName>) {
  const {disabled, onChange, defaultUnit = DurationUnit.seconds, value: fieldValue, ...rest} = props
  const [unit, setUnit] = useState<DurationUnit>(defaultUnit)
  const [value, setValue] = useState<string>("")

  useEffect(() => {

    if (isNull(fieldValue)) {
      setValue("")
    } else {
      const fieldStr = fieldValue.toString();

      const value = fieldStr.substring(2, fieldStr.length - 1)
      setValue(value)

      const unit = parseUnit(fieldStr.substring(fieldStr.length - 1))
      setUnit(unit)
    }

  }, [fieldValue])

  function handleChange(value: string, unit: DurationUnit) {
    onChange(`PT${value}${formatUnit(unit)}`)
  }

  function handleUnitChange(unit: DurationUnit) {
    setUnit(unit)
    handleChange(value, unit)
  }

  function handleValueChange(value: string) {
    setValue(value)
    handleChange(value, unit)
  }

  function parseUnit(unit: string): DurationUnit {
    switch (unit) {
      case "S":
        return DurationUnit.seconds;
      case "M":
        return DurationUnit.minutes;
      case "H":
        return DurationUnit.hours;
      default:
        return DurationUnit.days;
    }
  }

  function formatUnit(unit: DurationUnit) {
    switch (unit) {
      case "seconds":
        return "S"
      case "minutes":
        return "M"
      case "hours":
        return "H"
      case "days":
        return ""
    }
    return ""
  }

  return (
    <div className={"flex flex-row gap-[1px] items-center"}>
      <Input {...rest}
             type={"number"}
             className={"w-[100px]"}
             value={value}
             onChange={e => handleValueChange(e.target.value)} disabled={disabled}
      />
      <Select disabled={disabled}
              value={unit}
              onValueChange={value => handleUnitChange(value as DurationUnit)}>
        <SelectTrigger className="w-[80px]">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="seconds">秒</SelectItem>
            <SelectItem value="minutes">分</SelectItem>
            <SelectItem value="hours">时</SelectItem>
            <SelectItem value="days">天</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}