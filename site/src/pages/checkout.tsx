import { GetServerSideProps, NextPage } from 'next'
import { useMemo, useState } from 'react'
import { TrashSimple } from 'phosphor-react'

import { unstable_getServerSession } from 'next-auth'
import * as Icons from 'phosphor-react'
import { PencilSimple, MapPin, Storefront } from 'phosphor-react'

import { prisma } from '@/lib/prisma'
import { Product } from '@prisma/client'
import { styled } from '@/stitches.config'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import * as Select from '@/components/input/select'

import { authOptions } from './api/auth/[...nextauth]'
import Link from 'next/link'
import Router from 'next/router'
import { useSession } from 'next-auth/react'

const Container = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$sizes$800',

  padding: '$sizes$200',

  '@desktop': {
    padding: '$sizes$500 $sizes$400',
    width: '100%',
    maxWidth: '1600px',
    margin: 'auto',
  },
})

const SectionRoot = styled('section', {
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: '$sizes$100',
})

const SectionHeader = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
})

const Div = styled('div', {
  gap: '$sizes$100',
})

function formataCPF(cpf: string) {
  //retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, '')

  //realizar a formatação...
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

type CheckoutProps = {
  cpf: string
  cart: (Omit<Product, 'createdAt' | 'updatedAt'> & {
    brand: {
      name: string
    }
  })[]
  addresses: {
    street: string
  }[]
}

const shipping_data = [
  {
    id: '0',
    name: 'Expresso Padrão',
    pricing: 9.99,
    deliveryDate: new Date(2022, 11, 18).getTime(),
  },
  {
    id: '1',
    name: 'Sequoia',
    pricing: 29.99,
    deliveryDate: new Date(2022, 2, 7).getTime(),
  },
]

const payment_options = [
  {
    id: '0',
    name: 'Crédito',
  },
  {
    id: '2',
    name: 'Pix',
  },
]

const Checkout: NextPage<CheckoutProps> = ({
  cpf,
  cart: initialCart,
  addresses,
}) => {
  const [selected_shipping, setSelectedShipping] = useState(shipping_data[0].id) // value used to approximate the delivery date
  const [selected_payment, setSelectedPayment] = useState(payment_options[0].id)
  const [cart, setCart] = useState(initialCart)
  const { data } = useSession()

  const total = useMemo(() => {
    if (!cart) {
      return 0
    }

    const cartTotal = cart
      .map(({ price }) => price)
      .reduce((accumulator, a) => accumulator + a, 0)
    const shippingPrice =
      shipping_data.find(({ id }) => selected_shipping == id)?.pricing ||
      shipping_data[0].pricing

    return cartTotal + shippingPrice
  }, [cart, selected_shipping])

  return (
    <Container>
      {cart && cart.length === 0 ? (
        <SectionRoot>
          <SectionHeader>
            <Heading.subtitle2>
              Não achei nada no seu carrinho :/
            </Heading.subtitle2>
          </SectionHeader>
        </SectionRoot>
      ) : (
        <>
          {(addresses?.length || []) >= 1 ? (
            <SectionRoot>
              <SectionHeader>
                <MapPin size={44} />
                <Div
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Heading.subtitle2>Endereço De Entrega</Heading.subtitle2>
                  <Heading.paragraph>{addresses[0].street}</Heading.paragraph>
                </Div>
              </SectionHeader>
            </SectionRoot>
          ) : null}

          <SectionRoot>
            {cart &&
              cart.map(
                ({ id, name, description, brand, slug, images, price }) => (
                  <SectionRoot as="div" key={id}>
                    <SectionHeader>
                      <Storefront size={44} />

                      <Heading.subtitle2>{brand.name}</Heading.subtitle2>
                    </SectionHeader>

                    <Div
                      key={id}
                      css={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '$sizes$200',
                      }}
                    >
                      <img
                        style={{ objectFit: 'cover' }}
                        src={images[0]}
                        alt=""
                        width={'100px'}
                        height={'100px'}
                      />
                      {/* <Image size={80} alt="" /> */}

                      <Link passHref href={`/produto/${slug}`}>
                        <Div
                          as="a"
                          css={{
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: '700px',
                          }}
                        >
                          <Heading.subtitle3
                            css={{ textTransform: 'capitalize' }}
                          >
                            {name}
                          </Heading.subtitle3>
                          <Heading.paragraph css={{ color: '$grayLighter' }}>
                            {description.substring(0, 120)}...
                          </Heading.paragraph>

                          <Heading.subtitle3 css={{ color: '$successNormal' }}>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(price)}
                          </Heading.subtitle3>
                        </Div>
                      </Link>

                      <Button
                        variant="link"
                        onClick={async () => {
                          const body = JSON.stringify({
                            email: data?.user?.email,
                            productId: id,
                          })

                          const currentProductIndex = cart.findIndex(
                            (product) => product.id === id
                          )
                          const product = cart.slice(currentProductIndex)

                          setCart((cart) =>
                            cart.filter((product) => product.id !== id)
                          )

                          try {
                            const response = await fetch(
                              '/api/remove-item-from-cart',
                              {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Accept: 'application/json',
                                },
                                body,
                              }
                            )
                            const data = await response.json()
                            if (data.ok == true) {
                              // alert('Product remove do carrinho!')
                              // ok
                              return
                            } else if (data.message) {
                              alert(data.message)
                              return
                            }

                            alert('Something went wrong2')
                          } catch (error) {
                            console.log(error)
                            setCart((cart) =>
                              // @ts-ignore
                              cart.splice(currentProductIndex, 0, product)
                            )
                            alert('Something went wrong')
                          }
                        }}
                      >
                        <TrashSimple size={24} color="red" />
                      </Button>
                    </Div>
                  </SectionRoot>
                )
              )}
          </SectionRoot>

          <SectionRoot>
            <SectionHeader>
              <Heading.subtitle2>Opções De Envio</Heading.subtitle2>
            </SectionHeader>

            <Div
              css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '$sizes$300',
              }}
            >
              {shipping_data.map(({ id, name, pricing, deliveryDate }) => {
                const price = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(pricing)

                const formattedDate = new Intl.DateTimeFormat('pt-BR').format(
                  new Date(deliveryDate)
                )

                const isSelected = selected_shipping == id

                return (
                  <Div
                    css={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                    key={name}
                  >
                    <Heading.subtitle3>{name}</Heading.subtitle3>

                    <Heading.paragraph css={{ color: '$grayLighter' }}>
                      Os produtos devem chegar em {formattedDate}
                    </Heading.paragraph>

                    <Heading.subtitle3 css={{ color: '$successNormal' }}>
                      {price}
                    </Heading.subtitle3>

                    <Button
                      disabled={isSelected}
                      css={{
                        '&:disabled': {
                          filter: 'opacity(50%)',
                        },
                      }}
                      variant="outlined"
                      onClick={() => setSelectedShipping(id)}
                    >
                      {isSelected ? 'Selecionado' : 'Selecionar'}
                    </Button>
                  </Div>
                )
              })}
            </Div>
          </SectionRoot>

          <SectionRoot>
            <SectionHeader css={{ justifyContent: 'space-between' }}>
              <Heading.subtitle2>CPF</Heading.subtitle2>

              <Div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '$sizes$200',
                }}
              >
                <Heading.subtitle2 css={{ fontWeight: '$light' }}>
                  {formataCPF(String(cpf))}
                </Heading.subtitle2>

                <Link passHref href="/perfil/meus-dados">
                  <a>
                    <PencilSimple size={32} />
                  </a>
                </Link>
              </Div>
            </SectionHeader>
          </SectionRoot>

          <SectionRoot>
            <SectionHeader css={{ justifyContent: 'space-between' }}>
              <Heading.subtitle2>Opção De Pagamento</Heading.subtitle2>

              <Select.Select
                onValueChange={(newValue) => setSelectedPayment(newValue)}
                value={selected_payment}
              >
                <Select.SelectTrigger aria-label="Payment">
                  <Select.SelectValue
                    placeholder={
                      payment_options.find(({ id }) => selected_payment == id)
                        ?.name!
                    }
                  />

                  <Select.SelectIcon>
                    <Icons.CaretDown />
                  </Select.SelectIcon>
                </Select.SelectTrigger>

                <Select.SelectContent css={{ zIndex: '40' }}>
                  <Select.SelectScrollUpButton>
                    <Icons.CaretUp />
                  </Select.SelectScrollUpButton>

                  <Select.SelectViewport>
                    <Select.SelectGroup>
                      {payment_options.map(({ id, name }) => (
                        <Select.SelectItem key={id} value={id}>
                          <Select.SelectItemText>
                            <Heading.paragraph>{name}</Heading.paragraph>
                          </Select.SelectItemText>

                          <Select.SelectItemIndicator>
                            <Icons.Check />
                          </Select.SelectItemIndicator>
                        </Select.SelectItem>
                      ))}
                    </Select.SelectGroup>
                  </Select.SelectViewport>

                  <Select.SelectScrollDownButton>
                    <Icons.CaretDown />
                  </Select.SelectScrollDownButton>
                </Select.SelectContent>
              </Select.Select>
            </SectionHeader>
          </SectionRoot>

          <SectionRoot>
            <SectionHeader css={{ justifyContent: 'space-between' }}>
              <Heading.subtitle2>Detalhes De Pagamento</Heading.subtitle2>
            </SectionHeader>

            <Div
              css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '$sizes$100',

                width: '100%',

                '> div': {
                  width: '100%',
                },
              }}
            >
              {cart &&
                cart.map(({ id, name, price }) => (
                  <Div
                    key={id}
                    css={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Heading.subtitle3>{name}</Heading.subtitle3>
                    <Heading.subtitle3>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(price)}
                    </Heading.subtitle3>
                  </Div>
                ))}

              <Div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Heading.subtitle3>Frete</Heading.subtitle3>
                <Heading.subtitle3>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(
                    shipping_data.find(({ id }) => selected_shipping == id)
                      ?.pricing!
                  )}
                </Heading.subtitle3>
              </Div>

              <Div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Heading.subtitle3>Pagamento Total</Heading.subtitle3>

                <Heading.subtitle3>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(total)}
                </Heading.subtitle3>
              </Div>
            </Div>
          </SectionRoot>

          <SectionRoot
            css={{
              padding: '$sizes$100 $sizes$200',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              background: '$grayNormal',
              gap: '$sizes$300',
            }}
          >
            <Div
              css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '$sizes$50',
              }}
            >
              <Heading.subtitle3>Pagamento Total</Heading.subtitle3>
              <Heading.paragraph>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(total)}
              </Heading.paragraph>
            </Div>

            <Button
              css={{ width: '200px', height: '50px' }}
              variant="outlined"
              onClick={async () => {
                console.log(cart)
                let line_items = cart.map(({ images, name, price }) => ({
                  price_data: {
                    currency: 'brl',
                    product_data: {
                      name,
                      images,
                    },
                    unit_amount: Number((price * 100).toFixed(0)),
                  },
                  quantity: 1,
                }))

                const shippingPrice =
                  shipping_data.find(({ id }) => selected_shipping == id)
                    ?.pricing || shipping_data[0].pricing

                line_items.push({
                  price_data: {
                    currency: 'brl',
                    product_data: {
                      name: 'frete',
                      images: [],
                    },
                    unit_amount: shippingPrice * 100,
                  },
                  quantity: 1,
                })

                try {
                  const response = await fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      line_items: JSON.stringify(line_items),
                      success_url: `${window.location.origin}`,
                      cancel_url: window.location.href,
                    }),
                  })

                  const data = await response.json()

                  window.location = data.url
                } catch (error) {
                  console.log('error')
                  alert('Alguma coisa deu errado!')
                }
              }}
            >
              <Heading.paragraph>Fazer Pedido</Heading.paragraph>
            </Button>
          </SectionRoot>
        </>
      )}
    </Container>
  )
}

export default Checkout

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (!session) {
    return {
      props: {
        cart: [],
      },
      redirect: {
        destination: '/login',
      },
    }
  }

  // get CPF
  const user = await prisma.user.findFirst({
    where: {
      email: session.user?.email,
    },
    include: {
      cart: {
        include: {
          brand: {
            select: {
              name: true,
            },
          },
        },
      },
      addresses: {
        select: {
          street: true,
        },
      },
    },
  })

  if (!user) {
    return {
      props: {
        cart: [],
      },
      redirect: {
        destination: '/login',
      },
    }
  }

  return {
    props: {
      cart: user.cart.map((product) => ({
        ...product,
        createdAt: String(product.createdAt),
        updatedAt: String(product.updatedAt),
      })),
      cpf: '53094769896',
      addresses: user.addresses,
      // cpf: user.cpf,
    },
  }
}
