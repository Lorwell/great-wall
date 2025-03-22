import useApiRequest, {ApiRequestOptions} from "@/components/hooks/use-api-request.ts";
import {Result, Service} from "ahooks/lib/useRequest/src/types";
import {useCallback, useRef} from "react";
import {
  BaseListInputSchemaValues,
  FilterSchemaValues,
  PageOutput,
  PageRecords,
  SortDirectionEnum,
  SortInput
} from "@/constant/api/schema.ts";
import {ColumnFiltersState, OnChangeFn, PaginationState, SortingState, Updater} from "@tanstack/react-table";
import isEqual from "react-fast-compare";
import {DataTableFilter} from "@/components/custom-ui/data-table/types.ts";
import {isArray} from "radash";
import {getDateRangeValues} from "@/components/custom-ui/data-table/utils.ts";
import {NumberFormData} from "@/components/custom-ui/data-table/number-form-filter.tsx";
import {StringFormData} from "@/components/custom-ui/data-table/string-form-filter.tsx";

export type Conditions = [filter: ColumnFiltersState, sort: SortingState, keyword?: string]

export type TParams<Input extends BaseListInputSchemaValues> = [Input | undefined, PaginationState | undefined, Conditions | undefined]

export type UsePageTableApiRequestOptions<Row, Input extends BaseListInputSchemaValues> =
  ApiRequestOptions<PageRecords<Row>, [Input | undefined]>
  & {

  /**
   * 过滤器选项
   *
   * 如果未设置过滤器选项则忽略过滤条件
   */
  filterOptions?: DataTableFilter[]

}

export type PageTableResult<Row, Input extends BaseListInputSchemaValues> =
  Result<PageRecords<Row>, [Input | undefined]>
  & {
  pageState: PaginationState,
  setPageState?: OnChangeFn<PaginationState>
  page: PageOutput | undefined,
  records: Array<Row> | undefined,
  onTableChange?: (filter: ColumnFiltersState,
                   sort: SortingState,
                   keyword?: string) => void
}


/**
 * 数据表格请求
 */
export const useDataTableApiRequest = <Row, Input extends BaseListInputSchemaValues>(
  service: Service<PageRecords<Row>, [Input | undefined]>,
  {filterOptions, ...options}: UsePageTableApiRequestOptions<Row, Input> = {}
): PageTableResult<Row, Input> => {
  const inputRef = useRef<Input>();
  const conditionsRef = useRef<Conditions>([[], [], undefined]);
  const pageStateRef = useRef({pageIndex: 0, pageSize: 10});

  // 拼接表格参数
  const runService = useCallback(([input, pageState, conditions]: TParams<Input>) => {
    // @ts-ignore
    let params: Input = input || {}

    if (pageState) {
      params.current = pageState.pageIndex
      params.size = pageState.pageSize
    }

    if (conditions) {
      const [filter, sort, keyword] = conditions

      const filters: Array<FilterSchemaValues> = []

      // 设置过滤条件
      for (let filterEl of filter) {
        const columnId = filterEl.id;

        // 如果未匹配到过滤选项配置则忽略
        const filter = filterOptions?.find(it => it.columnId === columnId);
        if (!filter) continue

        const filterValue = filterEl.value;
        if (!filterValue) continue

        switch (filter.type) {
          case "Enum":
            filters.push({
              type: "In",
              column: columnId,
              values: isArray(filterValue) ? [...filterValue] : [filterValue]
            })
            break
          case "String":
            const stringValue = filterValue as StringFormData;
            filters.push({
              type: "Like",
              column: columnId,
              query: stringValue.query
            })
            break
          case "DateTime":
            const dateRangeValues = getDateRangeValues(filter, filterValue)!;
            filters.push({
              type: "Between",
              column: columnId,
              from: dateRangeValues.from,
              to: dateRangeValues.to
            })
            break
          case "Number":
            const {min, max} = filterValue as NumberFormData;

            if ((min || min === 0) && (max || max === 0)) {
              filters.push({
                type: "Between",
                column: columnId,
                from: min,
                to: max
              })
            } else if (min || min === 0) {
              filters.push({
                type: "Ge",
                column: columnId,
                value: min
              })
            } else if (max || max === 0) {
              filters.push({
                type: "Le",
                column: columnId,
                value: max
              })
            }
            break
        }
      }

      params.filters = filters
      params.keyword = keyword
      params.orderBy = sort.map(it => {
        return {
          column: it.id,
          direction: it.desc ? SortDirectionEnum.DESC : SortDirectionEnum.ASC
        } as SortInput
      })
    }

    return service(...[params]);
  }, [service, filterOptions]);

  const {data, run, cancel, ...rest} = useApiRequest((input) => {
    inputRef.current = input
    return runService([input, pageStateRef.current, conditionsRef.current])
  }, {
    // 默认 300ms 请求一次
    debounceWait: 300,
    manual: true,
    ...options
  });

  // 表格条件变更
  const handleTableChange = useCallback((filter: ColumnFiltersState, sort: SortingState, keyword?: string) => {
    conditionsRef.current = [filter, sort, keyword];
    run(inputRef.current)
  }, [])

  // 分页变更
  const onPageStateChange = useCallback((updater: Updater<PaginationState>) => {
    const oldValue = pageStateRef.current
    let newValue: PaginationState
    if (typeof updater === "function") {
      newValue = updater(oldValue)
    } else {
      newValue = updater
    }

    if (!isEqual(oldValue, newValue)) {
      pageStateRef.current = newValue
      run(inputRef.current)
    }
  }, [run]);

  return {
    ...rest,
    cancel,
    run,
    data,
    pageState: pageStateRef.current,
    setPageState: onPageStateChange,
    page: data?.page,
    records: data?.records,
    onTableChange: handleTableChange
  }
}
