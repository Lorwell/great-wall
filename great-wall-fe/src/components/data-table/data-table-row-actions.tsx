import {DotsHorizontalIcon} from "@radix-ui/react-icons"
import {Row} from "@tanstack/react-table"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {isEmpty, isNull} from "@/utils/Utils.ts";
import * as React from "react";
import {IconType} from "@/components/types.tsx";

export interface DataTableRowActionsOptions<TData> {

    /**
     * 唯一键
     */
    key?: string | number

    /**
     * 图标
     */
    icon?: IconType

    /**
     * 主内容
     */
    label?: string | React.ReactNode | React.ReactElement

    /**
     * 小提示
     */
    shortcut?: string | React.ReactNode | React.ReactElement

    /**
     * 分隔符，如果为 ture 则其他属性无效
     */
    separator?: boolean

    /**
     * 点击事件
     * @param row
     */
    onClick?: (row: Row<TData>) => void

    /**
     * 当前的条目值
     */
    radioValue?: any

    /**
     * 条目
     *
     * 如果该值不为空则 value 和 onClick 无效
     */
    radioItems?: DataTableRowActionsOptionsRadioItemOptions<TData>[]
}

export interface DataTableRowActionsOptionsRadioItemOptions<TData> {

    /**
     * 唯一键
     */
    key?: string | number

    /**
     * 主内容
     */
    label?: string | React.ReactNode | React.ReactElement

    /**
     * 值
     */
    value: any

    /**
     * 点击事件
     * @param row
     * @param value
     */
    onClick?: (row: Row<TData>, value: any) => void
}

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    options: DataTableRowActionsOptions<TData>[]
}

/**
 * 数据表操作行
 * @param row
 * @param options
 * @constructor
 */
export function DataTableRowActions<TData>({
                                               row,
                                               options,
                                           }: DataTableRowActionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <DotsHorizontalIcon className="h-4 w-4"/>
                    <span className="sr-only">打开菜单</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">

                {
                    options.map((option, index) => {
                        const key = option.key || index;

                        if (option.separator) {
                            return (<DropdownMenuSeparator key={key}/>)
                        } else if (!isEmpty(option.radioItems)) {
                            return (
                                <DropdownMenuSub key={key}>
                                    <DropdownMenuSubTrigger>{option.label}</DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup value={option.radioValue}>
                                            {option.radioItems!!.map((items, index) => (
                                                <DropdownMenuRadioItem key={items.key || index}
                                                                       value={items.value}
                                                                       onClick={() => items.onClick?.(row, items.value)}
                                                >
                                                    {items.label}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            )
                        } else {
                            return (
                                <DropdownMenuItem key={key} onClick={() => option.onClick?.(row)}>
                                    {
                                        /*@ts-ignore*/
                                        !isNull(option.icon) && <option.icon className="mr-2 h-4 w-4"/>
                                    }

                                    {option.label}

                                    {
                                        !isNull(option.shortcut) && (
                                            <DropdownMenuShortcut>{option.shortcut}</DropdownMenuShortcut>
                                        )
                                    }
                                </DropdownMenuItem>
                            )
                        }
                    })
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
