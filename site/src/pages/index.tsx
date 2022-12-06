import { FunctionComponent, Suspense, useEffect, useState } from 'react'
import { CSS } from '@stitches/react'
import type { NextPageWithLayout } from '@/@types/next'
import Link from 'next/link'
import { CaretUp, Columns, PlusCircle } from 'phosphor-react'

import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Icon } from '@/components/header'

import { styled } from '@/stitches.config'
import { trpc } from '@/lib/trpc'

import { Product } from '@/components/product'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import Carousel, { NavigationButton } from '@/components/carousel'
import { useSwiperRef } from '@/components/carousel/use-swiper'

const generateRandom = ({ min, max }: { min: number; max: number }) => {
  return Math.floor(min + Math.random() * (max - min - 1))
}

const SectionRoot = styled('section', {
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

  '.swiper': {
    '@tablet': {
      padding: '0 100px',
    },
  },

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

const SectionHeader = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '$sizes$400',

  a: {
    display: 'flex',
    color: '$grayLighter',
    gap: '$sizes$100',
  },
})

const ProductGrid = styled('ul', {
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '$sizes$400',

  '@tablet': {
    // gap: '$sizes$600',
    // justifyContent: 'space-between',
    li: {
      width: 'calc(100% / 2 - 24px)',
    },
  },

  '@desktop': {
    // gap: '$sizes$800',
    // justifyContent: 'space-between',
    li: {
      width: 'max-content',
    },
  },
})

const Home: NextPageWithLayout = () => {
  const { data: products, isLoading } = trpc.useQuery(['most-famous-products'])

  return (
    <>
      <Suspense fallback={null}>
        <Carousel />
      </Suspense>

      {/* mobile only */}
      <MobileDepartmentPills />

      <BuildYourPC />

      {/* mobile only */}
      <DailyOffers />

      <Brands />
      <Departments />

      <SectionRoot css={{ gap: '$sizes$600' }} align="left">
        <SectionHeader>
          <Heading.subtitle>Melhores Ofertas</Heading.subtitle>
          <Link href="/ofertas" passHref>
            <Heading.paragraph as="a">Todas Ofertas</Heading.paragraph>
          </Link>
        </SectionHeader>

        <ProductGrid css={{}}>
          {!isLoading &&
            products?.map((props, index) => (
              <li
                style={{ width: '280px', height: '490px !important' }}
                key={index}
              >
                <Product
                  css={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'space-between',
                  }}
                  {...props}
                />
              </li>
            ))}
        </ProductGrid>
      </SectionRoot>
    </>
  )
}

function DailyOffers() {
  const { data: offers, isLoading } = trpc.useQuery(['most-famous-products'])

  if (isLoading) {
    return null
  }

  return (
    <SectionRoot
      css={{
        '@tablet': { display: 'none' },
      }}
      align="left"
    >
      <SectionHeader>
        <Heading.subtitle>Ofertas Do Dia</Heading.subtitle>
        <Link href="/ofertas" passHref>
          <Heading.paragraph as="a" css={{ textDecoration: 'underline' }}>
            Todas Ofertas
          </Heading.paragraph>
        </Link>
      </SectionHeader>

      <Swiper
        slidesPerView="auto"
        freeMode={true}
        // slidesPerGroup={5}
        style={{
          background: 'transparent',
        }}
        spaceBetween={24}
        centeredSlides={false}
        grabCursor={true}
        navigation={{
          enabled: false,
        }}
        modules={[FreeMode, Navigation, Pagination, Autoplay]}
      >
        {offers?.map((props) => (
          <SwiperSlide
            style={{ width: '218px !important', height: '550px' }}
            key={props.id}
          >
            <Product
              {...props}
              css={{
                height: '100%',
                img: {
                  width: '218px !important',
                  height: '218px !important',
                  aspectRatio: '1/1',
                },
                main: {
                  height: '100%',
                },
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </SectionRoot>
  )
}

const MobileDepartmentPillsRoot = styled('ul', {
  display: 'flex',
  alignItems: 'center',
  padding: '$sizes$300',
  gap: '$sizes$100',

  '@tablet': {
    display: 'none',
  },
})

const DepartmentPill = styled('a', {
  background: '$grayNormal',
  padding: '$sizes$100 $sizes$200',
  borderRadius: '9999px',

  display: 'flex',
  gap: '$sizes$50',
  alignItems: 'center',

  '&:hover': {
    background: '$grayNormal',
  },
})

function MobileDepartmentPills() {
  const { data: departments, isLoading } = trpc.useQuery([
    'most-famous-departments',
  ])

  if (isLoading) {
    return null
  }

  return (
    <MobileDepartmentPillsRoot css={{ overflow: 'auto' }}>
      {departments?.map(({ name, slug }) => (
        <li style={{ flexShrink: 0 }} key={slug}>
          <Link href={`/${slug}`} passHref>
            <DepartmentPill>{name}</DepartmentPill>
          </Link>
        </li>
      ))}

      <li>
        <Link href="/catalogo" passHref>
          <DepartmentPill>
            Ver mais <PlusCircle />
          </DepartmentPill>
        </Link>
      </li>
    </MobileDepartmentPillsRoot>
  )
}

const DepartmentCard = styled('a', {
  width: '100%',
  height: '100%',
  borderRadius: '8px',

  h3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
  },

  img: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    borderRadius: '8px',
    filter: 'brightness(0.5)',
    transition: 'filter 250ms',
  },

  '&:hover': {
    img: {
      filter: 'brightness(0.6)',
    },
  },
})

const EmptyDepartment: FunctionComponent<{
  departmentsCount: number
}> = ({ departmentsCount }) => {
  const { data: departments, isLoading } = trpc.useQuery([
    'most-famous-departments',
    {
      take: 1,
      skip: generateRandom({
        min: 3,
        max: departmentsCount,
      }),
    },
  ])

  if (isLoading || !departments) {
    return null
  }

  return null
}

function Departments() {
  const [nextEl, nextElRef] = useSwiperRef<HTMLButtonElement>()
  const [prevEl, prevElRef] = useSwiperRef<HTMLButtonElement>()

  const { data: departmentsCount } = trpc.useQuery(['count-departments'])

  const { data: departments, isLoading } = trpc.useQuery([
    'most-famous-departments',
  ])

  if (isLoading) {
    return null
  }

  return (
    <SectionRoot
      css={{
        '@mobile': { '.swiper': { display: 'none' } },
        gap: '$sizes$200',
        '@desktop': { gap: '$sizes$800' },
      }}
      align="left"
    >
      <SectionHeader>
        <Heading.subtitle>Compre Por Departamento</Heading.subtitle>
        <Link href="/catalogo" passHref>
          <Heading.paragraph as="a">Ver Mais</Heading.paragraph>
        </Link>
      </SectionHeader>

      {departments
        ?.filter(({ products }) => products.length > 0)
        ?.map(({ name, slug, products }) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              gap: '16px',
              width: '100%',
            }}
            key={slug}
          >
            <SectionHeader>
              <Heading.subtitle2>{name}</Heading.subtitle2>
              <Link href={`/${slug}`} passHref>
                <Heading.paragraph as="a">Ver Mais</Heading.paragraph>
              </Link>
            </SectionHeader>

            <ul
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'stretch',
                overflow: 'auto',
                width: '100%',
              }}
            >
              {products.map((props) => (
                <li style={{ width: '218px' }} key={props.id}>
                  <Product
                    css={{ height: '100%', main: { flex: 1, width: '100%' } }}
                    {...props}
                  />
                </li>
              ))}

              {departmentsCount && departmentsCount > 3 && (
                <EmptyDepartment departmentsCount={departmentsCount} />
              )}
            </ul>
          </div>
        ))}

      <Swiper
        slidesPerView={5}
        freeMode={true}
        // slidesPerGroup={5}
        style={{
          background: 'transparent',
          padding:
            (departments?.length || 0) > 8 ? '0 100px' : '0px !important',
        }}
        spaceBetween={20}
        centeredSlides={false}
        grabCursor={false}
        navigation={{
          enabled: false,

          prevEl,
          nextEl,
        }}
        modules={[FreeMode, Navigation, Pagination, Autoplay]}
      >
        {departments?.map(({ name, slug, imgUrl }) => (
          <SwiperSlide
            key={slug}
            style={{
              width: '180px !important',
              height: '90px !important',
              background: 'none !important',
              borderRadius: '8px !important',
            }}
          >
            <Link href={`/${slug}`} passHref>
              <DepartmentCard>
                <Heading.subtitle2 css={{ color: '#fff' }}>
                  {name}
                </Heading.subtitle2>
                <img src={imgUrl} alt={`Department's ${name} image`} />
              </DepartmentCard>
            </Link>
          </SwiperSlide>
        ))}

        <NavigationButton ref={prevElRef} direction="left">
          <CaretUp size={24} weight="bold" />
        </NavigationButton>

        <NavigationButton ref={nextElRef} direction="right">
          <CaretUp size={24} weight="bold" />
        </NavigationButton>
      </Swiper>
    </SectionRoot>
  )
}

const BrandsGridRoot = styled('div', {
  '@mobile': {
    width: '100%',

    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    $$tileSize: 'calc((100% / 2) - (4px * 2))',
    gridGap: '$sizes$200',
    // gridTemplateColumns: 'repeat(2, $$tileSize)',
    // gridTemplateRows: 'repeat(2, $$tileSize)',
  },

  '@tablet': {
    display: 'none',
  },
})

const BrandTile = styled('li', {
  $$tileSize: 'calc((100% / 2) - (4px * 2))',
  width: '$$tileSize',
  aspectRatio: 1,
  height: 'auto',

  display: 'grid',
  placeItems: 'center',

  borderRadius: '$sizes$50',
  border: '1px solid $grayNormal',
})

function Brands() {
  const [nextEl, nextElRef] = useSwiperRef<HTMLButtonElement>()
  const [prevEl, prevElRef] = useSwiperRef<HTMLButtonElement>()
  const [initialRender, setInitialRender] = useState(true)

  const { data: brands, isLoading } = trpc.useQuery(['brands'])

  useEffect(() => {
    setInitialRender(false)
  }, [])

  if (isLoading || initialRender) {
    return null
  }

  return (
    <SectionRoot
      css={{ '@mobile': { '.swiper': { display: 'none' } } }}
      align="left"
    >
      <SectionHeader>
        <Heading.subtitle>Compre Por Marca</Heading.subtitle>
        <Link href="/marcas" passHref>
          <Heading.paragraph as="a">Ver Mais</Heading.paragraph>
        </Link>
      </SectionHeader>

      <Swiper
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 7,
          },
        }}
        freeMode={true}
        // slidesPerGroup={5}
        style={{
          background: 'transparent',
        }}
        spaceBetween={20}
        centeredSlides={false}
        grabCursor={true}
        navigation={{
          enabled: false,

          prevEl,
          nextEl,
        }}
        modules={[FreeMode, Navigation, Pagination, Autoplay]}
      >
        {brands?.map(({ name, slug, backgroundColor, brandLogoUrl }) => (
          <SwiperSlide
            style={{
              width: '130px !important',
              flexShrink: '0',
              height: '70px !important',
              background: backgroundColor,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '8px',
            }}
            key={slug}
          >
            <Link href={`/marcas/${slug}`} passHref>
              <a>
                <img
                  style={{
                    width: 'auto',
                    maxWidth: '80px',
                    height: '50px',
                    objectFit: 'contain',
                  }}
                  src={brandLogoUrl}
                  alt={`Brand's ${name} logo`}
                />
              </a>
            </Link>
          </SwiperSlide>
        ))}

        <NavigationButton ref={prevElRef} direction="left">
          <CaretUp size={24} weight="bold" />
        </NavigationButton>

        <NavigationButton ref={nextElRef} direction="right">
          <CaretUp size={24} weight="bold" />
        </NavigationButton>
      </Swiper>

      <BrandsGridRoot>
        {brands
          ?.slice(0, 4)
          .map(({ slug, name, brandLogoUrl, backgroundColor }) => (
            <Link key={slug} href={`/marcas/${slug}`} passHref>
              <BrandTile as="a" css={{ backgroundColor }}>
                <img
                  style={{
                    width: '40%',
                    objectFit: 'contain',
                  }}
                  src={brandLogoUrl}
                  alt={`Brand's ${name} logo`}
                />
              </BrandTile>
            </Link>
          ))}
      </BrandsGridRoot>
    </SectionRoot>
  )
}

const ComputerList = styled('ul', {
  width: '100%',

  paddingTop: '$sizes$500',

  '@desktop': {
    paddingTop: '$sizes$1000',
  },

  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'space-evenly',
})

const ComputerRoot = styled('li', {
  width: '250px',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',

  gap: '$sizes$200',

  '@desktop': {
    gap: '$sizes$400',
  },

  img: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    borderRadius: '$sizes$100',

    '@desktop': {
      width: '200px',
    },
  },

  p: {
    textAlign: 'center',
  },

  a: {
    width: '100%',
  },
})

const Computer: FunctionComponent<{
  name: string
  description: string
  isPrimary: boolean
  slug: string
  coverImage: string
  css?: CSS
}> = ({ name, coverImage, description, slug, css, isPrimary }) => {
  return (
    <ComputerRoot css={css}>
      <img src={coverImage} alt={`Image of the ${name} gaming PC`} />
      <Heading.subtitle2>{name}</Heading.subtitle2>
      <Heading.paragraph>{description}</Heading.paragraph>
      <Link href={`/pc-gamer/${slug}`} passHref>
        <Button
          css={
            isPrimary
              ? {
                  background: '$primaryNormal',
                  border: 'none',
                }
              : {}
          }
          variant="outlined"
          as="a"
        >
          <Heading.subtitle3>Personalizar</Heading.subtitle3>
        </Button>
      </Link>
    </ComputerRoot>
  )
}

function BuildYourPC() {
  const { data: computers, isLoading } = trpc.useQuery([
    'build-your-pc-computer-list',
  ])

  if (isLoading) {
    return null
  }

  return computers!.length > 0 ? (
    <SectionRoot
      align="center"
      css={{
        '@mobile': {
          width: 'calc(100% - ($sizes$300 * 2))',
          borderRadius: '$sizes$100',

          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background:
            'linear-gradient(0deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url("https://images.kabum.com.br/produtos/fotos/309501/pc-gamer-skul-3000-intel-quad-core-i3-10100f-rgb-amd-radeon-rx-550-8gb-ddr4-ssd-240gb-linux-preto-g4704-120630_1644605124_original.jpg")',
          backgroundSize: 'cover',
          p: {
            // width: '300px',
            textAlign: 'left',
            color: '$grayLightest',
          },
          '.mobile-build-pc-button': { display: 'flex' },
        },
        '@tablet': {
          '.mobile-build-pc-button': {
            display: 'none',
            background: 'none',
          },
        },
      }}
    >
      <Heading.subtitle>Monte o seu PC Gamer</Heading.subtitle>
      <Heading.paragraph>
        escolha uma das nossa opções e monte o seu pc gamer com os melhores
        preços do mercado
      </Heading.paragraph>

      <ComputerList
        css={{
          flexWrap: 'wrap',
          gap: '$sizes$1000',
          display: 'none',
          '@tablet': { display: 'flex' },
        }}
      >
        {computers?.map(({ id, images, ...props }) => (
          <Computer
            key={id}
            coverImage={images[0]}
            css={
              props.isPrimary
                ? {
                    '@desktop': {
                      transform: 'translate(0%, -4rem)',
                    },
                  }
                : {}
            }
            {...props}
          />
        ))}
      </ComputerList>

      <Link href="/pc-gamer" passHref>
        <Button
          variant="outlined"
          className="mobile-build-pc-button"
          css={{ borderColor: '$primaryNormal' }}
          as="a"
        >
          <Heading.subtitle3>Montar meu PC</Heading.subtitle3>
        </Button>
      </Link>
    </SectionRoot>
  ) : null
}

export default Home
