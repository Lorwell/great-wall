import React, {SetStateAction, useCallback, useRef, useState} from 'react';

type InferDefined<T> = T extends infer U | undefined ? U : never;

/**
 * 控制值的钩子
 * 在传递 controlled 值的情况下，返回 controlledValue，否则返回 defaultValue 中的值。
 * 通常用于包括受控和非受控模式的组件。
 * @param controlledValue
 * @param defaultValue
 */
export function useControlled<V = any, D = V>(controlledValue: V, defaultValue: D) {
  const controlledRef = useRef(false);
  controlledRef.current = controlledValue !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const value = controlledRef.current ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (nextValue: SetStateAction<D>) => {
      if (!controlledRef.current) {
        setUncontrolledValue(nextValue);
      }
    },
    [controlledRef]
  );

  return [value, setValue, controlledRef.current] as [
    V extends undefined ? D : InferDefined<V>,
    (value: React.SetStateAction<V | null>) => void,
    boolean
  ];
}
