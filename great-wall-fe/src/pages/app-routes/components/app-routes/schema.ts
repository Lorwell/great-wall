import {createContext} from "react";
import {AppRoutesConfValues, BaseInfoFormValues, PredicatesFormValues} from "@/constant/api/app-routes/schema.ts";


export interface AppRoutesDataOptions {

  /**
   * 基础信息
   */
  baseInfo?: Partial<BaseInfoFormValues>

  /**
   * 路由条件
   */
  predicates?: Partial<PredicatesFormValues>

}

export interface AppRoutesOptions extends AppRoutesDataOptions {

  /**
   * 设置基础信息
   * @param data
   */
  setBaseInfo?: (data: Partial<BaseInfoFormValues>) => void

  /**
   * 设置路由条件
   * @param data
   */
  setPredicates?: (data: Partial<PredicatesFormValues>) => void

  /**
   * 提交信息
   * @param data
   */
  onSubmit?: (data: Partial<AppRoutesConfValues>) => Promise<void>

}

export const AppRoutesContext = createContext<AppRoutesOptions>({});
