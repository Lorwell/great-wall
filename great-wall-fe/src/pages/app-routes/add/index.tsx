import Layout from "@/pages/app-routes/components/layout.tsx";
import {sidebarNavItems} from "@/pages/app-routes/add/route.tsx";


/**
 * 添加应用路由
 * @constructor
 */
function AddAppRoutes() {

    return (
        <div className={"w-full h-full"}>
            <Layout title={"新建应用路由"} subTitle={""} items={sidebarNavItems}/>
        </div>
    )
}

export default AddAppRoutes