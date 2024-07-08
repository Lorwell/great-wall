import {Spinner} from "@/components/custom-ui/spinner.tsx";
import {ReactNode} from "react";

export interface LoadingBlockProps {

  loading: boolean;

  children: ReactNode;
}

/**
 * 装载块
 * @constructor
 */
export default function LoadingBlock({loading, children}: LoadingBlockProps) {
  return (
    <>
      {loading && <Spinner className={"mt-20"}/>}
      {!loading && children}
    </>
  )
}