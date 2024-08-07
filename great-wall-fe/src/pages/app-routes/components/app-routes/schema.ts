import {createContext} from "react";
import {
  AppRoutesConfValues,
  BaseInfoFormValues,
  FiltersFormValues,
  PredicatesFormValues
} from "@/constant/api/app-routes/schema.ts";


export interface AppRoutesDataOptions {

  /**
   * 基础信息
   */
  baseInfo?: Partial<BaseInfoFormValues>

  /**
   * 路由条件
   */
  predicates?: Partial<PredicatesFormValues>

  /**
   * 路由插件
   */
  filters?: Partial<FiltersFormValues>

}

export interface AppRoutesOptions {


  /**
   * 提交信息
   * @param data
   */
  onSubmit?: (data: Partial<AppRoutesConfValues>) => Promise<void>

}

export const AppRoutesContext = createContext<AppRoutesOptions>({});
