import {CSSProperties, ReactNode, useEffect, useRef, useState} from "react";
import {useMemoizedFn, useThrottleFn} from "ahooks";
import {isNull} from "@/utils/Utils.ts";
import {cn} from "@/utils/shadcnUtils.ts";

export interface Size {
  width: number
  height: number
}

export interface AutoSizablePanelProps {
  style?: CSSProperties;
  className?: string
  children: ReactNode | ((size: Size) => ReactNode)

}

/**
 *
 * @param children
 * @param className
 * @param style
 * @constructor
 */
export default function AutoSizablePanel({children, className, style}: AutoSizablePanelProps) {

  const ref = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState<boolean>(false)
  const [size, setSize] = useState<Size>()

  const {run: resizeFn} = useThrottleFn(() => {
      if (isNull(ref.current)) {
        setSize(undefined)
      } else {
        setSize({
          width: ref.current!!.clientWidth,
          height: ref.current!!.clientHeight
        })
      }
      setResizing(false)
    },
    {
      wait: 300
    });

  const handleWindowInfo = useMemoizedFn(() => {
    setResizing(true)
    resizeFn()
  });

  useEffect(() => {
    handleWindowInfo();

    window.addEventListener("resize", handleWindowInfo);
    return () => {
      window.removeEventListener("resize", handleWindowInfo)
    }
  }, []);


  return (
    <div ref={ref} className={cn("w-full h-full", className)} style={style}>
      <div style={{opacity: 0, height: 0}}>仅用于撑开父div</div>

      {
        (!resizing && !isNull(size)) && (
          <>
            {typeof children === "function" ? children(size!!) : children}
          </>
        )
      }
    </div>
  )
}