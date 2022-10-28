import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react'

export interface ModalHandles {
  open: () => void
  close: () => void
}

type ModalProps = {
  visible: boolean
  children: React.ReactNode
}

const Modal: React.ForwardRefRenderFunction<ModalHandles, ModalProps> = (
  { children, visible: initialVisible },
  ref
) => {
  const [visible, setVisible] = useState(initialVisible)

  const open = useCallback(() => {
    document.body.classList.add('modal-overlay')
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    document.body.classList.remove('modal-overlay')
    setVisible(false)
  }, [])

  useImperativeHandle(ref, () => ({
    open,
    close,
  }))

  if (!visible) {
    return null
  }

  return <>{children}</>
}

export default forwardRef(Modal)
