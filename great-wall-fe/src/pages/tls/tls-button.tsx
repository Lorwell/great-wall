import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {ChevronDown, ShieldCheck} from "lucide-react";
import {useNavigate} from "react-router-dom";

export interface TlsButtonProps {

  type: "add" | "update"

}

/**
 * 证书按钮
 * @constructor
 */
export default function TlsButton({type}: TlsButtonProps) {
  const navigate = useNavigate();

  const title = type === "add" ? "添加证书" : "修改证书"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} className="w-40">
          <ShieldCheck className={"w-6 h-6"}/>
          <span className={"ml-2"}>{title}</span>
          <ChevronDown className={"ml-2 w-6 h-6"}/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem onClick={() => navigate(`/manage/tls/custom`)}>
          自定义证书
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/manage/tls/osfipin`)}>
          来此加密
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}