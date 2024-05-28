import {ControllerRenderProps} from "react-hook-form";
import {
  HostPredicatesFormValues,
  PredicatesOperatorSchemaValues
} from "@/pages/app-routes/components/app-routes/schema.ts";
import {Input} from "@/components/ui/input.tsx";
import {PredicateTypeEnum} from "@/constant/api/app-routes/types.ts";
import {forwardRef, Ref} from "react";

export interface HostPredicateProps extends Omit<ControllerRenderProps<Partial<PredicatesOperatorSchemaValues>, "predicate.value">, "ref"> {


}

/**
 * host 路由条件
 * @constructor
 */
const HostPredicate = forwardRef((props: HostPredicateProps, ref: Ref<any>) => {
  const {onChange, value, ...rest} = props

  const hostValue = value as Partial<HostPredicatesFormValues>;

  return (
    <Input ref={ref}
           {...rest}
           value={hostValue.value}
           onChange={e =>
             onChange({
               type: PredicateTypeEnum.Host,
               value: e.target.value
             })}
    />
  )
})

export default HostPredicate

