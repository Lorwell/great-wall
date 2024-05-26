import {DataTable} from "@/components/data-table/data-table.tsx";
import {columns} from "@/pages/app-routes/list/columns.tsx";
import {data} from "@/pages/app-routes/list/data.ts";
import {RowContext} from "@/pages/app-routes/list/RowActions.tsx";
import {useNavigate} from "react-router-dom";
import {LayoutPanelLeft} from "lucide-react";


/**
 * 应用路由列表
 * @constructor
 */
function AppRoutesList() {

    const navigate = useNavigate();

    /**
     * 查看事件
     * @param ctx
     */
    function handleView(ctx: RowContext) {

    }

    /**
     * 编辑事件
     * @param ctx
     */
    function handleEdit(ctx: RowContext) {

    }

    /**
     * 查看事件
     * @param ctx
     */
    function handleOffline(ctx: RowContext) {

    }

    /**
     * 查看事件
     * @param ctx
     */
    function handleOnline(ctx: RowContext) {

    }

    return (
        <div className={"w-full h-full"}>
            <DataTable data={data}
                       searchColumnId={"name"}
                       manual={false}
                       columns={columns({
                           event: {
                               onView: handleView,
                               onEdit: handleEdit,
                               onOffline: handleOffline,
                               onOnline: handleOnline,
                           }
                       })}
                       plusOptions={[
                           {
                               label: "新建应用路由",
                               icon: LayoutPanelLeft,
                               onClick: () => navigate("/manage/app-routes/add"),
                           }
                       ]}
            />
        </div>
    )
}

export default AppRoutesList