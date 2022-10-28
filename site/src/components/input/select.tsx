import { mauve } from '@radix-ui/colors'
import * as SelectPrimitive from '@radix-ui/react-select'

import { styled } from '@/stitches.config'
import { FunctionComponent, ReactNode } from 'react'
import { CSS } from '@stitches/react'

const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$sizes$50',
  padding: '$sizes$50 $sizes$100',
  fontSize: '$small',
  width: 'max-content',
  height: '20px',
  gap: '$sizes$100',
  backgroundColor: 'transparent',
  color: '$grayLighter',
  border: '1px solid $grayNormal',

  '&:hover, &:focus': {
    color: '$grayLighter',
    borderColor: '$grayLighter',
  },
  '&[data-placeholder]': { color: 'red' },
})

const StyledIcon = styled(SelectPrimitive.SelectIcon, {
  color: '$grayLighter',
})

const StyledContent = styled(SelectPrimitive.Content, {
  overflow: 'hidden',
  backgroundColor: '$grayDarker',
  borderRadius: '$sizes$50',
  border: '1px solid $grayNormal',
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
})

const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: '$sizes$50',
})

const Content: FunctionComponent<{
  children: ReactNode
  css?: CSS
}> = ({ children, ...props }) => {
  return (
    <SelectPrimitive.Portal>
      <StyledContent {...props}>{children}</StyledContent>
    </SelectPrimitive.Portal>
  )
}

const StyledItem = styled(SelectPrimitive.Item, {
  all: 'unset',

  fontSize: '$small',

  color: '$primaryNormal',
  borderRadius: '$sizes$50',

  display: 'flex',
  alignItems: 'center',
  height: '$300',
  padding: '0 $sizes$300 0 $sizes$300',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: '$grayDarker',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    backgroundColor: '$primaryNormal',
    color: '$primaryLighter',
  },
})

const StyledLabel = styled(SelectPrimitive.Label, {
  padding: '0 $sizes$300',
  fontSize: 12,
  lineHeight: '$sizes$300',
  color: mauve.mauve11,
})

const StyledSeparator = styled(SelectPrimitive.Separator, {
  height: 1,
  backgroundColor: 'red',
  margin: 5,
})

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: '$sizes$300',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const scrollButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '$sizes$300',
  backgroundColor: 'white',
  color: 'red',
  cursor: 'default',
}

const StyledScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles
)

const StyledScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles
)

// Exports
export const Select = SelectPrimitive.Root
export const SelectTrigger = StyledTrigger
export const SelectValue = SelectPrimitive.Value
export const SelectIcon = StyledIcon
export const SelectContent = Content
export const SelectViewport = StyledViewport
export const SelectGroup = SelectPrimitive.Group
export const SelectItem = StyledItem
export const SelectItemText = SelectPrimitive.ItemText
export const SelectItemIndicator = StyledItemIndicator
export const SelectLabel = StyledLabel
export const SelectSeparator = StyledSeparator
export const SelectScrollUpButton = StyledScrollUpButton
export const SelectScrollDownButton = StyledScrollDownButton
