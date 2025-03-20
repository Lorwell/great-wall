import {ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon,} from "@radix-ui/react-icons"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.tsx"
import {Table} from "@tanstack/react-table"
import {Button} from "@/components/ui/button.tsx"
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination.tsx";

interface DataTablePaginationProps<TData> {
  table: Table<TData>

  /**
   * 最多的按钮
   */
  maxButtons?: number

  /**
   * 是否显示省略号
   */
  ellipsis?: boolean

  /**
   *  显示边框分页按钮 1 和页面
   * */
  boundaryLinks?: boolean;
}

/**
 * 数据表分页
 * @constructor
 */
export function DataTablePagination<TData>(props: DataTablePaginationProps<TData>) {
  const {
    table,
    maxButtons = 3,
    ellipsis = true,
    boundaryLinks = true
  } = props

  /**
   * 渲染分页按钮
   */
  function renderPageButtons(): React.ReactElement[] {
    const pageButtons: React.ReactElement[] = [];
    let startPage;
    let endPage;
    let hasHiddenPagesAfter;

    const activePage = table.getState().pagination.pageIndex + 1
    const pages = table.getPageCount()

    if (maxButtons) {
      const hiddenPagesBefore = activePage - Math.floor(maxButtons / 2);
      startPage = hiddenPagesBefore > 1 ? hiddenPagesBefore : 1;
      hasHiddenPagesAfter = startPage + maxButtons <= pages;

      if (!hasHiddenPagesAfter) {
        endPage = pages;
        startPage = pages - maxButtons + 1;
        if (startPage < 1) {
          startPage = 1;
        }
      } else {
        endPage = startPage + maxButtons - 1;
      }
    } else {
      startPage = 1;
      endPage = pages;
    }

    for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
      pageButtons.push(
        <PaginationItem key={`page-${pageNumber}`} onClick={() => table.setPageIndex(pageNumber - 1)}>
          <PaginationLink href="#" isActive={pageNumber === activePage}>{pageNumber}</PaginationLink>
        </PaginationItem>
      )
    }

    if (boundaryLinks && ellipsis && startPage !== 1) {
      pageButtons.unshift(
        <PaginationItem key={`page-ellipsis-first`}>
          <PaginationEllipsis/>
        </PaginationItem>
      );

      pageButtons.unshift(
        <PaginationItem key={`page-1`} onClick={() => table.setPageIndex(0)}>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
      );
    }

    if (maxButtons && hasHiddenPagesAfter && ellipsis) {
      pageButtons.push(
        <PaginationItem key={`page-ellipsis`}>
          <PaginationEllipsis/>
        </PaginationItem>
      );

      if (boundaryLinks && endPage !== pages) {
        pageButtons.push(
          <PaginationItem key={`page-${pages}`} onClick={() => table.setPageIndex(pages - 1)}>
            <PaginationLink href="#">{pages}</PaginationLink>
          </PaginationItem>
        );
      }
    }
    return pageButtons;
  }

  return (
    <div className="flex items-center justify-end px-2">
      <div className="flex items-center space-x-3 lg:space-x-6">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          共 {table.getRowCount()} 条
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">页长度</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize}/>
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">首页</span>
            <DoubleArrowLeftIcon className="h-4 w-4"/>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">上一页</span>
            <ChevronLeftIcon className="h-4 w-4"/>
          </Button>
          <Pagination>
            <PaginationContent>
              {renderPageButtons()}
            </PaginationContent>
          </Pagination>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">下一页</span>
            <ChevronRightIcon className="h-4 w-4"/>
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">尾页</span>
            <DoubleArrowRightIcon className="h-4 w-4"/>
          </Button>
        </div>
      </div>
    </div>
  )
}
