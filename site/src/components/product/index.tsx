import { FunctionComponent } from 'react'
import { Rating } from 'react-simple-star-rating'
import StarRatings from 'react-star-ratings'
import { ShoppingCart } from 'phosphor-react'

import { styled } from '@/stitches.config'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { convertRatingToPercentage } from '../carousel'
import { CSS } from '@stitches/react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export type ProductProps = {
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
    // maxWidth: '230px',
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
  name,
  price,
  images,
  rating,
  sold,
  css,
  slug,
  id,
}) => {
  const formattedTitle = name.substring(0, 35)
  const { status, data: userdata } = useSession()

  return (
    <ProductRoot css={css}>
      <img src={images[0]} alt={`Product's ${name} picture`} />

      <ProductContent>
        <Link style={{ height: '50px' }} href={`/produto/${slug}`} passHref>
          <Heading.paragraph
            as="a"
            css={{ strong: { color: '$grayLightest' }, height: '50px' }}
          >
            <strong>{formattedTitle}</strong>
          </Heading.paragraph>
        </Link>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <StarRatings
            rating={convertRatingToPercentage(rating)}
            starRatedColor="#D1C647"
            starDimension="16px"
            starSpacing="2px"
            numberOfStars={5}
            name="rating"
          />
          {/* <Rating
            initialValue={convertRatingToPercentage(rating)}
            fillColor="#D1C647"
            emptyColor="#F5F2D6"
            size={24}
            readonly
          /> */}

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

        <Heading.subtitle3 css={{ fontSize: '$h6 !important' }}>
          {currency.format(price)}
        </Heading.subtitle3>

        <Heading.paragraph>à vista</Heading.paragraph>

        <ProductActions>
          <Link href={`/produto/${slug}`} passHref>
            <Button
              as="a"
              variant="outlined"
              css={{ borderColor: '$primaryNormal', flex: 1 }}
            >
              <Heading.paragraph css={{ color: '$grayLightest !important' }}>
                Comprar
              </Heading.paragraph>
            </Button>
          </Link>

          <Button
            variant="outlined"
            className="cart"
            disabled={status !== 'authenticated' ? true : false}
            onClick={async () => {
              if (status !== 'authenticated') {
                return
              }

              const body = JSON.stringify({
                email: userdata?.user?.email,
                productId: id,
              })

              try {
                const response = await fetch('/api/add-item-to-cart', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                  },
                  body,
                })
                const data = await response.json()
                if (data.ok == true) {
                  alert('Product adicionado ao carrinho')
                  // ok
                  return
                } else if (data.message) {
                  alert(data.message)
                  return
                }

                alert('Something went wrong2')
              } catch (error) {
                console.log(error)
                alert('Something went wrong')
              }
            }}
          >
            <ShoppingCart size={24} />
          </Button>
        </ProductActions>
      </ProductContent>
    </ProductRoot>
  )
}
