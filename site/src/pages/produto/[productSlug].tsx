import { GetServerSideProps, NextPage } from 'next'
import { CreditCard, QrCode, Truck, ShoppingCart } from 'phosphor-react'
import Router, { useRouter } from 'next/router'

import { prisma } from '@/lib/prisma'
import { styled } from '@/stitches.config'
import { Heading } from '@/components/heading'
import { Rating } from 'react-simple-star-rating'
import { convertRatingToPercentage } from '@/components/carousel'
import { Button } from '@/components/button'
import { ProductProps } from '@/components/product'
import { useState } from 'react'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { useSession } from 'next-auth/react'

const Container = styled('main', {
  maxWidth: '1600px',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',

  padding: '$sizes$300',

  '@tablet': {
    padding: '$sizes$500',
  },

  '@desktop': {
    padding: '$sizes$500 $sizes$200 !important',
  },

  gap: '$sizes$200',

  variants: {
    align: {
      left: {
        alignItems: 'flex-start',
        padding: '$sizes$400',
      },
      center: {
        alignItems: 'center',
      },
    },
  },

  p: {
    textAlign: 'center',
    color: '$grayLighter',
  },
})

const ProductContainer = styled('section', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '$sizes$300',
  justifyContent: 'space-between',
})

const OtherPhotos = styled('div', {
  width: '150px',
  flexShrink: '0',

  display: 'flex',
  flexDirection: 'column',
  gap: '$sizes$300',

  outline: '3px solid transparent',

  '[data-selected="true"]': {
    outline: '3px solid $primaryNormal',
  },

  img: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
})

const MainImage = styled('img', {
  cursor: 'pointer',
  flex: 1,
  width: '430px',
  aspectRatio: '1/1',
  height: 'auto',
  objectFit: 'cover',
  // width: '430px',
  // height: '335px',
  borderRadius: '5px',
})

const Sidebar = styled('div', {
  width: 'max-content',
  display: 'flex',
  flexDirection: 'column',
  gap: '$sizes$400',
  padding: '$sizes$400',

  background: '$grayDarker',
})

const SidebarSection = styled('section', {
  padding: '$sizes$300',
  display: 'flex',
  gap: '$sizes$100',
})

const SidebarCardContent = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: '$sizes$50',
})

const Product: NextPage<{
  product: ProductProps | null
}> = ({ product }) => {
  const { push } = useRouter()
  const { status, data: userdata } = useSession()
  const [selectedImage, setSelectedImage] = useState(product?.images[0] || '')
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <Container>
      <ProductContainer>
        <OtherPhotos>
          {[...new Set(product?.images)].map((image, index) => (
            <button
              data-selected={selectedImage == image}
              onClick={() => setSelectedImage(image)}
              key={index}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </OtherPhotos>

        <Zoom>
          <MainImage src={selectedImage} />
        </Zoom>

        <Sidebar>
          <Heading.subtitle>{product?.name}</Heading.subtitle>

          <Rating
            initialValue={convertRatingToPercentage(product?.rating || 0)}
            fillColor="#D1C647"
            emptyColor="#F5F2D6"
            size={32}
            readonly
          />

          <SidebarSection>
            <CreditCard size={70} />

            <SidebarCardContent
              css={{ '*': { color: '$grayLightest !important' } }}
            >
              <Heading.small>
                De{' '}
                {currencyFormatter.format(
                  product?.price! + product?.price! * (10 / 100)
                )}
              </Heading.small>
              <Heading.subtitle3>
                Por {currencyFormatter.format(product?.price!)}
              </Heading.subtitle3>
              <Heading.small>
                12x de{' '}
                {currencyFormatter.format(Math.round(product?.price || 1 / 12))}{' '}
                s/juros no cartão
              </Heading.small>
            </SidebarCardContent>
          </SidebarSection>

          <SidebarSection css={{ opacity: '50%', cursor: 'not-allowed' }}>
            <QrCode size={70} />

            <SidebarCardContent
              css={{ '*': { color: '$grayLightest !important' } }}
            >
              <Heading.subtitle3>PIX</Heading.subtitle3>
              <Heading.subtitle3>
                R${' '}
                {Math.floor(
                  product?.price! - product?.price! * (10 / 100)
                ).toFixed(2)}
              </Heading.subtitle3>
              <Heading.small>
                À vista com 10% de desconto no boleto ou pix
              </Heading.small>
            </SidebarCardContent>
          </SidebarSection>

          <SidebarSection>
            <Truck size={70} />

            <SidebarCardContent
              css={{ '*': { color: '$grayLightest !important' } }}
            >
              <Heading.paragraph>Fretes Grátis</Heading.paragraph>
              <Heading.paragraph>
                Saiba os prazos de entrega e as formas de envio
              </Heading.paragraph>
              <Button
                variant="link"
                onClick={() => {
                  console.log('open modal')
                }}
              >
                Calcular o Prazo
              </Button>
            </SidebarCardContent>
          </SidebarSection>

          <SidebarSection css={{ justifyContent: 'center' }}>
            <Button
              variant="default"
              css={{ flex: 1, background: '$primaryNormal', border: 'none' }}
              onClick={async () => {
                if (status !== 'authenticated') {
                  return
                }
                const body = JSON.stringify({
                  email: userdata?.user?.email,
                  productId: product?.id,
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
                    push('/checkout')
                    // ok
                    return
                  } else if (data.message) {
                    push('/checkout')
                    return
                  }

                  alert('Alguma coisa deu errado :/')
                } catch (error) {
                  console.log(error)
                  alert('Alguma coisa deu errado :(')
                }
              }}
            >
              <Heading.subtitle3>Comprar</Heading.subtitle3>
            </Button>
            <Button
              variant="default"
              css={{ width: '50px', height: '50px', padding: '$sizes$100' }}
              disabled={status !== 'authenticated' ? true : false}
              onClick={async () => {
                if (status !== 'authenticated') {
                  return
                }
                const body = JSON.stringify({
                  email: userdata?.user?.email,
                  productId: product?.id,
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
              <ShoppingCart size={50} />
            </Button>
          </SidebarSection>
        </Sidebar>
      </ProductContainer>
    </Container>
  )
}

export default Product

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { productSlug } = params!

  // find product
  const product = await prisma.product.findFirst({
    where: {
      slug: String(productSlug),
    },
  })

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    }
  }

  return {
    props: {
      product: {
        ...product,
        createdAt: String(product.createdAt),
        updatedAt: String(product.updatedAt),
      },
    },
  }
}
