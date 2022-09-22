import { styled } from '@/stitches.config'
import { FunctionComponent, InputHTMLAttributes, ReactNode, useId } from 'react'

export const InputRoot = styled('input', {
  color: '$grayLightest',

  padding: '$sizes$100',

  border: '1px solid $grayNormal',
  borderRadius: '$sizes$50',

  fontSize: '$h6',

  transition: 'all 250ms',

  '&:focus': {
    borderColor: '$grayLighter',
  },
})

const InputWithLabel: FunctionComponent<
  {
    children: ReactNode
    placeholder: string
  } & InputHTMLAttributes<HTMLInputElement>
> = ({ children, style, ...props }) => {
  const id = useId()

  return (
    <label style={style} htmlFor={props.id || id}>
      {children}

      <InputRoot css={{ width: '100%' }} id={props.id || id} {...props} />
    </label>
  )
}

const Label: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>
}

export const Input = {
  Root: InputRoot,
  WithLabel: InputWithLabel,
  Label,
}
