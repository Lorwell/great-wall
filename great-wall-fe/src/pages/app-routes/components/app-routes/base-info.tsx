import {Separator} from "@/components/ui/separator.tsx";

/**
 *  应用路由的基础信息
 * @constructor
 */
function BaseInfo() {

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">基础配置</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    应用路由的基本信息
                </p>
            </div>
            <Separator/>

            <div>
                // TODO
            </div>
        </div>
    )
}

export default BaseInfo