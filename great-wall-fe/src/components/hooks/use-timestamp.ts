import {useCallback} from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * 格式化时间
 */
const useTimestamp = () => {

  const formatTime = useCallback((value: number, format: string) => {
    return dayjs.unix(value).format(format)
  }, [])

  return {formatTime}
}

export default useTimestamp
