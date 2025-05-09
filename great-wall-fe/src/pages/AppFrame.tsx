import {ResizableHandle, ResizablePanel, ResizablePanelGroup,} from "@/components/ui/resizable"
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import {useState} from "react";
import {cn} from "@/lib/shadcnUtils.ts";
import {Outlet} from "react-router-dom";
import {Nav} from "@/components/nav.tsx";
import {navConfig} from "@/pages/navConfig.ts";
import {Separator} from "@/components/ui/separator";
import {ModeToggle} from "@/components/mode-toggle.tsx";
import AutoSizablePanel from "@/components/custom-ui/auto-sizable-panel.tsx";

/**
 * 应用框架
 * @constructor
 */
const AppFrame = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={15}
                        minSize={10}
                        maxSize={20}
                        collapsedSize={4}
                        collapsible={true}
                        onCollapse={() => setIsCollapsed(true)}
                        onExpand={() => setIsCollapsed(false)}
                        className={cn(
                          isCollapsed &&
                          "min-w-[50px] transition-all duration-300 ease-in-out"
                        )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            Great Wall
          </div>
          <Separator/>
          <Nav isCollapsed={isCollapsed}
               links={navConfig}
          />
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel defaultSize={85}>

          <div className={"flex flex-col gap-4 px-4 sm:py-3 h-full w-full box-border"}>

            <div className={"flex flex-row justify-end"}>
              <ModeToggle/>
            </div>

            <AutoSizablePanel className={"flex-auto overflow-hidden"}>
              {
                (size) => (
                  <div style={{...size}}>
                    <Outlet/>
                  </div>
                )
              }
            </AutoSizablePanel>
          </div>

        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}

export default AppFrame