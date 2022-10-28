import { FunctionComponent } from 'react'
import { Rating } from 'react-simple-star-rating'
import { ShoppingCart } from 'phosphor-react'

import { styled } from '@/stitches.config'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { convertRatingToPercentage } from '../carousel/index.client'
import { CSS } from '@stitches/react'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type ProductProps = {
  id: string

  name: string
  slug: string
  description: string

  // number of stars
  rating: number

  price: number

  images: string[]
  blurredImages: string[]

  sold: number

  departmentSlug: string

  stripeId: string

  createdAt: Date
  updatedAt: Date

  css?: CSS
}

const ProductRoot = styled('div', {
  borderRadius: '$sizes$100',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',

  '*': {
    textAlign: 'left !important',
  },

  width: '100%',

  '@desktop': {
    maxWidth: '230px',
  },

  background: '$grayDarker',

  img: {
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit',

    width: '100%',
    height: '164px',
    objectFit: 'cover',
  },
})

const ProductContent = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$sizes$200',
  alignItems: 'flex-start',
  justifyContent: 'space-between',

  padding: '$sizes$200',
})

const ProductActions = styled('footer', {
  width: '100%',
  height: '40px',

  display: 'flex',
  alignItems: 'center',
  gap: '$sizes$50',

  button: {
    height: '100%',
    justifyContent: 'center',
  },

  '.buy-now': {
    flex: 1,
    p: {
      fontWeight: '$light',
    },
    height: '100%',
  },

  '.cart': {
    width: 'auto',
    aspectRatio: 1,
    padding: '$sizes$100',
  },
})

export const Product: FunctionComponent<ProductProps> = ({
  id,
  name,
  price,
  images,
  rating,
  sold,
  css,
}) => {
  return (
    <ProductRoot css={css}>
      <img src={images[0]} alt={`Product's ${name} picture`} />

      <ProductContent>
        <Heading.paragraph css={{ strong: { color: '$grayLightest' } }}>
          <strong>{name.substring(0, 60)}</strong>
        </Heading.paragraph>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <Rating
            ratingValue={convertRatingToPercentage(rating)}
            fillColor="#D1C647"
            emptyColor="#F5F2D6"
            size={24}
            readonly
          />

          <Heading.paragraph>{`(${sold})`}</Heading.paragraph>
        </div>
        <Heading.paragraph
          css={{ display: 'flex', alignItems: 'center', gap: '$sizes$50' }}
        >
          <span style={{ textDecoration: 'line-through' }}>
            {currency.format(price)}
          </span>
          por
        </Heading.paragraph>

        <Heading.subtitle3>{currency.format(price)}</Heading.subtitle3>

        <Heading.paragraph>à vista</Heading.paragraph>

        <ProductActions>
          <Button
            variant="outlined"
            css={{ borderColor: '$primaryNormal', flex: 1 }}
          >
            <Heading.paragraph>Comprar</Heading.paragraph>
          </Button>

          <Button variant="outlined" className="cart">
            <ShoppingCart size={24} />
          </Button>
        </ProductActions>
      </ProductContent>
    </ProductRoot>
  )
}
