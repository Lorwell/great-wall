import {Card, CardContent} from "@/components/ui/card.tsx";
import {ReactNode, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";

export interface FilterCardProps {
  title: string
  icon: ReactNode
  description?: string | ReactNode
  children?: string | ReactNode
  onSubmit?: () => Promise<boolean | void> | void | boolean
  onRemove?: () => Promise<void> | void
  enable?: boolean
  showDescription?: boolean
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
    description,
    children,
    onSubmit,
    onRemove,
    enable,
    showDescription = true
  } = props;

  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className={"w-52"}>
        <CardContent className={"py-4 flex flex-col items-stretch gap-2"}>
          <div className="flex flex-row items-center gap-2 h-8">
            {icon}
            <span className={"text-lg"}>{title}</span>
          </div>
          {
            showDescription && (
              <div className={"text-sm h-12 text-ellipsis overflow-hidden"}>
                {description}
              </div>
            )
          }
          <div className={"flex flex-row justify-between items-center"}>
               <span className={"text-xs"}>
                  身份验证
               </span>
            <Button variant={"secondary"}
                    className={"h-8"}
                    type={"button"}
                    onClick={(event) => {
                      event.preventDefault()
                      setOpen(true)
                    }}>
              {enable ? "编辑" : "启用"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader className="text-left">
            <SheetTitle>
              {title}
            </SheetTitle>
            <SheetDescription>
              {description}
            </SheetDescription>
          </SheetHeader>

          <div className={"mt-6"}>
            {children}
          </div>

          <div className={"mt-6 flex flex-row justify-end gap-4"}>

            {
              enable && (
                <Button variant={"destructive"}
                        onClick={async (event) => {
                          event.preventDefault()
                          event.stopPropagation();
                          await onRemove?.();
                          setOpen(false);
                        }}
                >
                  删除
                </Button>
              )
            }

            <Button variant={"secondary"}
                    onClick={async (event) => {
                      event.preventDefault()
                      event.stopPropagation();

                      const result = await onSubmit?.();
                      if (result === false) {
                        return
                      }

                      setOpen(false);
                    }}
            >
              保存
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
