import TlsButton from "@/pages/tls/tls-button.tsx";

/**
 * 空的证书页面
 * @constructor
 */
export default function EmptyTls() {

  return (
    <div className={"flex flex-row items-center justify-center border rounded-lg h-80"}>
      <div className={"flex flex-col items-center gap-4"}>
        <TlsButton type={"add"}/>
      </div>
    </div>
  )
}