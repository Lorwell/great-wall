import {Spinner} from "@/components/custom-ui/spinner.tsx";

/**
 * 加载回退
 * @constructor
 */
const SuspenseFallback = () => {
  return (
    <div className={"w-screen h-screen flex align-items-center justify-content-center"}>
      <Spinner/>
    </div>
  )
}
export default SuspenseFallback