import { startTransition, useEffect, useRef, useState } from 'react'

export const useSwiperRef = <T extends HTMLElement>(): [
  T | null,
  React.Ref<T>
] => {
  const [wrapper, setWrapper] = useState<T | null>(null)
  const ref = useRef<T>(null)

  useEffect(() => {
    if (ref.current) {
      startTransition(() => {
        setWrapper(ref.current)
      })
    }
  }, [])

  return [wrapper, ref]
}
