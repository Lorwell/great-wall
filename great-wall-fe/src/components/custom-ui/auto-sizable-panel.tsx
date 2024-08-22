import {CSSProperties, ReactNode, useEffect, useRef, useState} from "react";
import {useDebounceFn, useMemoizedFn} from "ahooks";
import {isNull} from "@/utils/Utils.ts";
import {cn} from "@/utils/shadcnUtils.ts";

export interface Size {
  width: number
  height: number
}

export interface AutoSizablePanelProps {
  style?: CSSProperties;
  className?: string
  children: ((size: Size) => ReactNode)
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
  const [size, setSize] = useState<Size>()

  const {run: resizeFn} = useDebounceFn(() => {
        if (isNull(ref.current)) {
          setSize(undefined)
        } else {
          setSize({
            width: ref.current!!.clientWidth,
            height: ref.current!!.clientHeight
          })
        }
      },
      {
        wait: 200
      });

  const handleWindowInfo = useMemoizedFn(() => {
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
            (!isNull(size)) && (
                <>
                  {children(size!!)}
                </>
            )
        }
      </div>
  )
}