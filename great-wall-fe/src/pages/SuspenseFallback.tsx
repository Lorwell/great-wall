import {Spinner} from "@/components/custom-ui/spinner.tsx";

/**
 * 加载回退
 * @constructor
 */
const SuspenseFallback = () => {
  return (
    <div className={"w-screen h-screen flex flex-row items-center justify-center"}>
      <Spinner className={"mt-20"}/>
    </div>
  )
}
export default SuspenseFallback