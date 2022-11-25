import {
  CSSProperties,
  FunctionComponent,
  startTransition,
  useState,
} from 'react'
import { ShoppingCart, CaretUp } from 'phosphor-react'

import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { trpc } from '@/lib/trpc'
import { styled, keyframes, theme } from '@/stitches.config'

import { useSwiperRef } from './use-swiper'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Rating } from 'react-simple-star-rating'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

// basically, the 'rating' prop is the number of stars
// prop i need to provide to the <Rating /> component is in percentage
// so im just converting

type Tuple<T> = [T, T]

const scale = (
  inputY: number,
  yRange: Tuple<number>,
  xRange: Tuple<number>
) => {
  const [xMin, xMax] = xRange
  const [yMin, yMax] = yRange

  const percent = (inputY - yMin) / (yMax - yMin)
  const outputX = percent * (xMax - xMin) + xMin

  return outputX
}

const MAX_NUMBER_OF_STARS = 5

export const convertRatingToPercentage = (rating: number) => {
  return scale(rating, [0, MAX_NUMBER_OF_STARS], [0, 100])
}

const FillContainer = keyframes({
  from: {
    backgroundSize: '0% 100%',
  },
  to: {
    backgroundSize: '100% 100%',
  },
})

const NavigationProgress = styled('div', {
  width: 'max-content !important',

  display: 'none',
  alignItems: 'center',

  zIndex: 15,
  gap: '$sizes$100',

  position: 'absolute !important',

  '@desktop': {
    display: 'flex !important',

    top: 'unset !important',
    left: 'unset !important',
    bottom: '$sizes$200 !important',
    right: '$sizes$400 !important',
  },

  '.swiper-pagination-bullet-active': {
    '&:after': {
      animation: `${FillContainer} 3200ms linear`,
    },
  },

  '&[data-autoplay-running="true"]': {
    '.swiper-pagination-bullet-active': {
      '&:after': {
        animationPlayState: 'running',
      },
    },
  },

  '&[data-autoplay-running="false"]': {
    '.swiper-pagination-bullet-active': {
      color: '$grayNormal',
      '&:before': {
        background: '$grayNormal',
      },
      '&:after': {
        animation: 'none',
        backgroundSize: '0% 100%',
      },
    },
  },

  '.swiper-pagination-bullet': {
    all: 'unset',
    width: '144px',
    position: 'relative',

    cursor: 'pointer',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '$sizes$50',

    color: '$grayLighter',

    '&:before': {
      content: '',

      width: '144px',
      height: '8px',
      background: '$grayLighter',
      transition: 'background 250ms',
    },

    '&:after': {
      content: '',

      position: 'absolute',
      top: 0,
      left: 0,

      width: '100%',
      height: '8px',
      backgroundImage:
        'linear-gradient(to right, $grayLightest, $grayLightest)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '0% 100%',
      transition: 'all 250ms',
    },

    '&-active': {
      color: '$grayLightest',
    },

    '&-active:hover, &-active:focus': {
      color: '$grayLighter',

      '&:after': {
        backgroundSize: '0% 100%',
      },
    },

    '&:hover, &:focus': {
      color: '$grayLightest',

      '&:after': {
        backgroundSize: '100% 100%',
      },
    },
  },
})

export const NavigationButton = styled('button', {
  borderRadius: '50%',
  background: '$grayDarkest',
  padding: '$sizes$100',

  border: '2px solid $grayLighter',

  position: 'absolute',

  top: '50%',
  zIndex: 10,

  display: 'none',

  '@tablet': {
    display: 'grid',
  },
  placeItems: 'center',

  cursor: 'pointer',

  '&:hover, &:focus': {
    borderColor: '$grayLightest',
  },

  '&:focus-visible': {
    outlineOffset: '4px',
    outline: '2px solid $grayLighter',
    borderColor: '$grayLighter',
  },

  variants: {
    direction: {
      left: {
        left: '$sizes$400',
        transform: 'translate(0%, -50%) rotate(-90deg)',
      },
      right: {
        right: '$sizes$400',
        transform: 'translate(0%, -50%) rotate(90deg)',
      },
    },
  },
})

const ProductRootStyles: CSSProperties = {
  width: '80vw',
  // maxWidth: '1024px',
  position: 'relative',
}

const ProductCard = styled('div', {
  width: '255px',

  position: 'absolute',
  left: '10vw',

  // left: 'calc($sizes$1000 * 2)',
  transform: 'translate(0%, -50%)',
  zIndex: 10,
  bottom: '10%',

  '> *:not(.title)': {
    display: 'none !important',
  },

  '@tablet': {
    top: '50%',

    '> *:not(.title)': {
      display: 'flex !important',
    },

    span: {
      display: 'inline-block',
    },
  },

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  gap: '$sizes$200',

  p: {
    opacity: '80%',
  },
})

const ProductBackgroundImageContainer = styled('div', {
  width: '100%',
  height: '100%',
  img: {
    width: '100%',
    objectFit: 'fill',
  },

  position: 'relative',

  '&:before': {
    content: '',

    aspectRatio: '1',

    background: 'rgba(0, 0, 0, 0.8)',

    width: '101%',
    height: '101%',

    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    zIndex: 5,
  },
})

const ProductButtonWrapper = styled('footer', {
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

const Carousel: FunctionComponent = () => {
  const { status, data: userdata } = useSession()

  const { data: homepageSlides, isLoading } = trpc.useQuery([
    'get-homepage-slides',
  ])

  const [autoplayRunning, setAutoplayRunning] = useState(true)

  const [nextEl, nextElRef] = useSwiperRef<HTMLButtonElement>()
  const [prevEl, prevElRef] = useSwiperRef<HTMLButtonElement>()

  if (isLoading || !homepageSlides) {
    return <div>loading...</div>
  }

  return (
    <>
      <Swiper
        onAutoplayResume={() =>
          startTransition(() => {
            setAutoplayRunning(true)
          })
        }
        onAutoplayStart={() =>
          startTransition(() => {
            setAutoplayRunning(true)
          })
        }
        onAutoplayStop={() =>
          startTransition(() => {
            setAutoplayRunning(false)
          })
        }
        onAutoplayPause={() =>
          startTransition(() => {
            setAutoplayRunning(false)
          })
        }
        slidesPerView={1.3}
        // slidesPerView="auto"
        style={{
          background: theme.colors['grayDarkest'].value,
          width: '100%',
          maxWidth: '1600px !important',
          overflow: 'hidden',
          height: '60vh',
          maxHeight: '1000px !important',
        }}
        spaceBetween={20}
        centeredSlides={true}
        grabCursor={true}
        navigation={{
          enabled: false,

          prevEl,
          nextEl,
        }}
        loop={true}
        autoplay={{
          delay: 3000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.carousel-swiper-pagination',
          renderBullet: (index, className) => {
            return `
              <button class="${className}">${String(index + 1).padStart(
              2,
              '0'
            )}</button>
            `
          },
          // dynamicBullets: true,
        }}
        modules={[Navigation, Pagination, Autoplay]}
      >
        {homepageSlides?.map(
          ({ id, name, description, rating, slug, coverUrl }) => {
            return (
              <SwiperSlide style={ProductRootStyles} key={id}>
                <ProductCard>
                  <Link href={`/produto/${slug}`} passHref>
                    <a className="title">
                      <Heading.subtitle
                        as="h1"
                        css={{
                          '@mobile': { fontSize: '$h6 !important' },
                          color: '#fff',
                        }}
                      >
                        {name}
                      </Heading.subtitle>
                    </a>
                  </Link>

                  <Heading.paragraph css={{ color: 'hsl(0, 0%, 70%)' }}>
                    {description.substring(0, 60)}
                  </Heading.paragraph>

                  <Rating
                    ratingValue={convertRatingToPercentage(rating)}
                    fillColor="#D1C647"
                    emptyColor="#F5F2D6"
                    size={24}
                    readonly
                  />

                  <ProductButtonWrapper>
                    <Link href={`/produto/${slug}`} passHref>
                      <Button
                        as="a"
                        css={{
                          background: '$primaryNormal',
                          border: 'none',
                          color: '#fff',
                          p: {
                            fontWeight: 'bold !important',
                          },
                        }}
                        className="buy-now"
                        variant="default"
                        tabIndex={-1}
                      >
                        <Heading.paragraph>Comprar Agora</Heading.paragraph>
                      </Button>
                    </Link>

                    <Button
                      className="cart"
                      variant="outlined"
                      css={{ background: 'transparent', borderColor: '#fff' }}
                      tabIndex={-1}
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
                          const response = await fetch(
                            '/api/add-item-to-cart',
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
                      <ShoppingCart color={'#fff'} size={24} />
                    </Button>
                  </ProductButtonWrapper>
                </ProductCard>

                <ProductBackgroundImageContainer>
                  <img
                    src={coverUrl}
                    alt={`Image of the ${name} product with description $`}
                  />
                </ProductBackgroundImageContainer>
              </SwiperSlide>
            )
          }
        )}

        <NavigationProgress
          data-autoplay-running={autoplayRunning}
          className="carousel-swiper-pagination"
        />

        <NavigationButton ref={prevElRef} direction="left">
          <CaretUp size={24} weight="bold" />
        </NavigationButton>

        <NavigationButton ref={nextElRef} direction="right">
          <CaretUp size={24} weight="bold" />
        </NavigationButton>
      </Swiper>

      <button className="swiper-button-prev">Prev button</button>
      <button className="swiper-button-next">Next button</button>
    </>
  )
}

export default Carousel
