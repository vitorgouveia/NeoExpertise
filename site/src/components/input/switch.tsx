import * as SwitchPrimitive from '@radix-ui/react-switch'

import { styled } from '@/stitches.config'

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',

  width: '32px',
  height: '20px',

  backgroundColor: 'transparent',
  border: '1px solid $grayNormal',
  borderRadius: '9999px',
  position: 'relative',

  transition: 'background 250ms',

  // boxShadow: `0 2px 10px red`,
  // WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

  '&:focus': {
    borderColor: '$grayLighter',
    // boxShadow: `0 0 0 2px black`,
    span: {
      background: '$grayLighter',
    },
  },

  '&[data-state="checked"]': {
    backgroundColor: 'black',
  },
})

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  width: '14px',
  height: '14px',
  backgroundColor: 'white',
  borderRadius: '9999px',
  // boxShadow: `0 2px 2px red`,
  transition: 'transform 100ms',
  transform: 'translateX(4px)',
  willChange: 'transform',

  '&[data-state="checked"]': {
    transform: 'translateX(calc(32px - 14px - 4px))',
  },
})

export const Switch = StyledSwitch
export const SwitchThumb = StyledThumb
