import {Card, CardContent} from "@/components/ui/card.tsx";
import {ReactNode, useState} from "react";
import {Button} from "@/components/ui/button.tsx";

export interface FilterCardProps extends FilterCardSwitchProps {
  title: string
  icon: ReactNode
  children?: string | ReactNode
  showChildren?: boolean
}

/**
 * 过滤器卡片
 * @param props
 * @constructor
 */
export default function FilterCard(props: FilterCardProps) {
  const {
    title,
    icon,
    children,
    enable,
    showChildren = true,
    onEnableChange
  } = props;

  return (
    <Card className={"w-52"}>
      <CardContent className={"py-4 flex flex-col items-stretch gap-2"}>
        <div className="flex flex-row items-center gap-2 h-8">
          {icon}
          <span className={"text-lg"}>{title}</span>
        </div>
        {
          showChildren && (
            <div className={"text-sm h-12 text-ellipsis overflow-hidden"}>
              {children}
            </div>
          )
        }
        <div className={"flex flex-row justify-between items-center"}>
               <span className={"text-xs"}>
                  身份验证
               </span>
          <FilterCardSwitch enable={enable} onEnableChange={onEnableChange}/>
        </div>
      </CardContent>
    </Card>
  )
}

export interface FilterCardSwitchProps {
  enable?: boolean
  onEnableChange?: (enable: boolean) => void
}

function FilterCardSwitch(props: FilterCardSwitchProps) {
  const {enable = false, onEnableChange} = props
  const [checked, setChecked] = useState<boolean>(enable);

  return (
    <Button variant={"secondary"}
            className={"h-8"}
            type={"button"}
            onClick={(event) => {
              event.preventDefault()

              const value = !checked
              setChecked(value);
              onEnableChange?.(value)
            }}>
      {checked ? "取消" : "启用"}
    </Button>
  )
}