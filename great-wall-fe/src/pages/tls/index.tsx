import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {tlsDetails} from "@/constant/api/app-tls";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import {isNull} from "@/utils/Utils.ts";
import EmptyTls from "@/pages/tls/empty.tsx";
import Details from "@/pages/tls/details.tsx";

/**
 * 证书页面
 * @constructor
 */
export default function Tls() {

  const {data, loading} = useApiRequest(tlsDetails);

  return (
    <div className={"w-full h-full"}>
      {loading && <Spinner className={"mt-20"}/>}
      {!loading && isNull(data) && (<EmptyTls/>)}
      {!loading && !isNull(data) && (<Details data={data!!}/>)}
    </div>
  )
}
