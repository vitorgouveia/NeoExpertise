import * as SwitchPrimitive from '@radix-ui/react-switch'

import { styled } from '@/stitches.config'

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',

  cursor: 'pointer',

  '--toggle-size': '32px',
  width: 'var(--toggle-size)',
  height: '20px',

  backgroundColor: 'transparent',
  border: '1px solid $grayNormal',
  borderRadius: '9999px',
  position: 'relative',

  transition: 'background 250ms',

  // boxShadow: `0 2px 10px red`,
  // WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

  '&:focus-visible': {
    outlineOffset: '2px',
    outline: '2px solid $grayLighter',
    // borderColor: '$grayLightest',
    // // boxShadow: `0 0 0 2px black`,
    // span: {
    //   background: '$grayLightest',
    // },
  },

  '&[data-state="checked"]': {
    backgroundColor: 'black',
  },
})

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  '--thumb-size': '14px',
  width: 'var(--thumb-size)',
  height: 'var(--thumb-size)',
  backgroundColor: 'white',
  borderRadius: '9999px',
  // boxShadow: `0 2px 2px red`,
  transition: 'transform 100ms',
  transform: 'translateX(4px)',
  willChange: 'transform',

  '&[data-state="checked"]': {
    transform: 'translateX(calc(var(--toggle-size) - var(--thumb-size) - 4px))',
  },
})

export const Switch = StyledSwitch
export const SwitchThumb = StyledThumb
