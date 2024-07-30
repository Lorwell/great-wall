import {Card, CardContent} from "@/components/ui/card.tsx";
import {ReactNode} from "react";
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
    showChildren = true,
    ...rest
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
          <FilterCardSwitch {...rest}/>
        </div>
      </CardContent>
    </Card>
  )
}

export interface FilterCardSwitchProps {
  enable?: boolean
  onClick?: () => void
}

function FilterCardSwitch({enable = false, onClick}: FilterCardSwitchProps) {

  return (
    <Button variant={"secondary"}
            className={"h-8"}
            type={"button"}
            onClick={(event) => {
              event.preventDefault()
              onClick?.();
            }}>
      {enable ? "编辑" : "启用"}
    </Button>
  )
}