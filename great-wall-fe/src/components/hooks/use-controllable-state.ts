import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react"
import {useCallbackRef} from "./use-callback-ref"
import isEqual from "react-fast-compare";

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/use-controllable-state/src/useControllableState.tsx
 */
type UseControllableStateParams<T> = {
  prop?: T | undefined
  defaultProp: T
  onChange?: (state: T) => void
}

type SetStateFn<T> = (prevState: T) => T

const emptyChange = () => {
}

function useControllableState<T>(
  {
    prop,
    defaultProp,
    onChange = emptyChange,
  }: UseControllableStateParams<T>): [T, Dispatch<SetStateAction<T>>] {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({defaultProp, onChange})
  const handleChange = useCallbackRef(onChange)

  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledProp

  const setValue = useCallback<Dispatch<SetStateAction<T>>>((nextValue) => {
    if (isControlled) {
      const setter = nextValue as SetStateFn<T>
      const value = typeof nextValue === "function" ? setter(prop) : nextValue
      if (!isEqual(value, prop)) handleChange(value as T)
    } else {
      const setter = nextValue as SetStateFn<T>
      const value = typeof nextValue === "function" ? setter(uncontrolledProp) : nextValue
      if (!isEqual(value, uncontrolledProp)) setUncontrolledProp(value)
    }
  }, [isControlled, prop, handleChange, uncontrolledProp, setUncontrolledProp])

  return [value, setValue] as const
}

function useUncontrolledState<T>(
  {
    defaultProp,
    onChange,
  }: Omit<UseControllableStateParams<T>, "prop">) {
  const uncontrolledState = useState<T>(() => defaultProp)
  const [value] = uncontrolledState
  const prevValueRef = useRef(value)
  const handleChange = useCallbackRef(onChange)

  useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T)
      prevValueRef.current = value
    }
  }, [value, prevValueRef, handleChange])

  return uncontrolledState
}

export {useControllableState}
