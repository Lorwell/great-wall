import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {tlsDetails} from "@/constant/api/app-tls";
import {isNull} from "@/utils/Utils.ts";
import EmptyTls from "@/pages/tls/empty.tsx";
import Details from "@/pages/tls/details.tsx";
import LoadingBlock from "@/components/custom-ui/loading-block";

/**
 * 证书页面
 * @constructor
 */
export default function Tls() {

  const {data, loading, run} = useApiRequest(tlsDetails);

  return (
    <div className={"w-full h-full"}>
      <LoadingBlock loading={loading}>
        {isNull(data) && (<EmptyTls/>)}
        {!isNull(data) && (<Details data={data!!} onRefresh={run}/>)}
      </LoadingBlock>
    </div>
  )
}
