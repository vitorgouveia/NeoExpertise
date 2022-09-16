import { styled } from '@/stitches.config'

export const InputRoot = styled('input', {
  color: '$grayLightest',

  padding: '$sizes$50',

  border: '2px solid $grayNormal',
  borderRadius: '$sizes$50',

  transition: 'all 250ms',

  '&:focus': {
    borderColor: '$grayLighter',
  },
})

export const Input = {
  Root: InputRoot,
}
