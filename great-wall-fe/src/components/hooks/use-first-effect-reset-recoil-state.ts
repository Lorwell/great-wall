import {RecoilState, useResetRecoilState} from "recoil";
import {useEffect} from "react";

/**
 * 在页面第一次加载时重置状态
 * @param recoilState
 */
export default function useFirstEffectResetRecoilState(recoilState: RecoilState<any>) {
  const resetAppRoutesDataOptionsState = useResetRecoilState(recoilState);
  useEffect(() => {
    resetAppRoutesDataOptionsState()
  }, []);

}