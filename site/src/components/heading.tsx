import { styled } from '@/stitches.config'

const title = styled('h1', {
  fontSize: '$h1',
})

const subtitle = styled('h2', {
  fontSize: '$h4',
})

const subtitle2 = styled('h3', {
  fontSize: '$h5',
})

const subtitle3 = styled('h4', {
  fontSize: '$h6',
  fontWeight: '$semibold',
})

const paragraph = styled('p', {
  fontSize: '$paragraph',
})

const small = styled('small', {
  fontSize: '$small',
})

export const Heading = {
  title,
  subtitle,
  subtitle2,
  subtitle3,
  paragraph,
  small,
}
