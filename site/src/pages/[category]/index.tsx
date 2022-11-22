import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { prisma } from '@/lib/prisma'
import type { Product as IProduct } from '@prisma/client'
import * as Icons from 'phosphor-react'

import { styled } from '@/stitches.config'
import { Heading } from '@/components/heading'
import { Product } from '@/components/product'
import * as Select from '@/components/input/select'
import { useMemo, useState } from 'react'
import { useTypeSafeRouterParams } from '../pc-gamer/[pc]'

const CategoryCoverRoot = styled('section', {
  height: '40vh',
  display: 'grid',
  placeItems: 'center',
})

const LayoutRoot = styled('main', {
  maxWidth: '1600px',
  margin: '0 auto',

  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',

  gap: '$sizes$500',

  '@mobile': {
    flexDirection: 'column',
    gap: '0',
  },

  '@tablet': {
    padding: '$sizes$400 $sizes$200',
  },

  '@desktop': {
    gap: '$sizes$1000',
  },
})

const SidebarRoot = styled('aside', {
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '$sizes$600',

  display: 'flex',

  '@mobile': {
    display: 'none',
  },
})

const MobileSidebar = styled('section', {
  width: '100%',
  background: '$grayDarker',
  padding: '$sizes$200 $sizes$300',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '$sizes$300',

  '@mobile': {
    display: 'flex',
  },

  '@tablet': {
    display: 'none',
  },
})

const AllDepartments = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '$sizes$400',
})

const DepartmentRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$sizes$50',
})

const SubDepartment = styled('a', {
  color: '$grayLighter',
})

const Filters = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$sizes$50',

  button: {
    fontSize: '$paragraph',
    width: 'max-content',
    padding: 0,
    justifyContent: 'flex-start',
    color: '$grayLighter',
  },

  '[data-active="true"]': {
    color: '$grayLightest',
  },
})

const ProductGrid = styled('ul', {
  flex: 1,
  display: 'flex',
  alignItems: 'flex-start',
  flexWrap: 'wrap',

  width: '80%',
  margin: '0 auto',
  justifyContent: 'center',
  gap: '$sizes$300',

  '@mobile': {
    padding: '$sizes$300',
  },

  '@tablet': {
    li: {
      justifyContent: 'center',
      width: '218px',
    },
  },

  '@desktop': {
    justifyContent: 'flex-start',
  },
})

const sorts = [
  {
    name: 'Relevantes',
    comparatorFunction: (
      products: Array<IProduct & { createdAt: number }>
    ): IProduct[] => {
      // console.log(products)
      return products.sort(
        (a, b) =>
          b.rating - a.rating ||
          b.sold - a.sold ||
          b.price - a.price ||
          b.description.length - a.description.length
      )
    },
  },
  {
    name: 'Mais vendidos',
    comparatorFunction: (
      products: Array<IProduct & { createdAt: number }>
    ): IProduct[] => products.sort((a, b) => b.sold - a.sold),
  },
  {
    name: 'Recentes',
    comparatorFunction: (
      products: Array<IProduct & { createdAt: number }>
    ): IProduct[] => products.sort((a, b) => a.createdAt - b.createdAt),
  },
  {
    name: 'Mais avaliados',
    comparatorFunction: (
      products: Array<IProduct & { createdAt: number }>
    ): IProduct[] => products.sort((a, b) => b.rating - a.rating),
  },
  {
    name: 'Preço: Baixo para Alto',
    comparatorFunction: (
      products: Array<IProduct & { createdAt: number }>
    ): IProduct[] => products.sort((a, b) => a.price - b.price),
  },
  {
    name: 'Preço: Alto para Baixo',
    comparatorFunction: (
      products: Array<IProduct & { createdAt: number }>
    ): IProduct[] => products.sort((a, b) => b.price - a.price),
  },
] as const

type AvailableSorts = typeof sorts[number]['name']

const Department: NextPage<{
  products: Array<IProduct & { createdAt: number }>
  department: {
    name: string
    imgUrl: string
    slug: string
  } | null
  departments:
    | {
        slug: string
        name: string
        subDepartments: {
          slug: string
          name: string
        }[]
      }[]
    | undefined
}> = ({
  departments: allDepartments,
  products: virtualProducts = [],
  department,
}) => {
  const { query, replace, push } = useTypeSafeRouterParams<{
    category: string
    sort: AvailableSorts
  }>(useRouter())
  const [sort, setSort] = useState(query.sort || 'Relevantes')

  const sortedProducts = useMemo(() => {
    const currentSort = sorts.find(({ name }) => sort === name)

    if (!currentSort) {
      return virtualProducts
    }

    return currentSort.comparatorFunction(virtualProducts)
  }, [virtualProducts, sort])

  if (!department) {
    return <div>could not find</div>
  }

  return (
    <>
      <CategoryCoverRoot
        css={{
          backgroundImage: `
            linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.7),
              rgba(0, 0, 0, 0.7)
            ),
            url("${department?.imgUrl}")
          `,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <Heading.title>{department?.name}</Heading.title>
      </CategoryCoverRoot>

      <LayoutRoot>
        <SidebarRoot>
          <AllDepartments>
            <Heading.subtitle2>All categories</Heading.subtitle2>

            {allDepartments?.map(({ slug, name, subDepartments }) => (
              <DepartmentRoot key={slug}>
                <Link href={`/${slug}`} passHref>
                  <Heading.subtitle3
                    css={
                      name === department.name
                        ? {
                            color: '$grayLightest',
                          }
                        : {
                            color: '$grayLighter',
                          }
                    }
                    as="a"
                  >
                    {name}
                  </Heading.subtitle3>
                </Link>

                <ul>
                  {subDepartments.map(({ slug: subSlug, name: subName }) => (
                    <li key={subSlug}>
                      <Link href={`/${slug}/${subSlug}`}>
                        <SubDepartment>
                          {subName.substring(0, 20)}
                          {subName.length > 20 ? '...' : null}
                        </SubDepartment>
                      </Link>
                    </li>
                  ))}
                </ul>
              </DepartmentRoot>
            ))}
          </AllDepartments>

          <Filters>
            <Heading.subtitle2>Filtros</Heading.subtitle2>
            {sorts.map(({ name }) => (
              <Heading.paragraph
                key={name}
                onClick={() => {
                  setSort(name)
                  replace(`/${query.category}?sort=${name}`)
                }}
                data-active={sort === name}
                as="button"
              >
                {name}
              </Heading.paragraph>
            ))}
          </Filters>
        </SidebarRoot>

        <MobileSidebar>
          <Select.Select
            onValueChange={(newValue) => push(`/${newValue}`)}
            value={department.slug}
          >
            <Select.SelectTrigger aria-label="Department">
              <Select.SelectValue placeholder={department.name} />

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
                  {allDepartments?.map(({ name, slug }) => (
                    <Select.SelectItem key={name} value={slug}>
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
        </MobileSidebar>

        {virtualProducts.length === 0 ? (
          <ProductGrid>nenhum produto</ProductGrid>
        ) : (
          <ProductGrid>
            {sortedProducts.map((props, index) => (
              <li key={index}>
                <Product
                  {...props}
                  css={{
                    height: '550px',
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
              </li>
            ))}
          </ProductGrid>
        )}
      </LayoutRoot>
    </>
  )
}

export default Department

export const getServerSideProps: GetServerSideProps<
  {},
  { category: string }
> = async ({ params }) => {
  const departments = await prisma.department.findMany({
    orderBy: {
      soldProducts: 'desc',
    },
    select: {
      slug: true,
      name: true,
      subDepartments: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  })

  const department = await prisma.department.findFirst({
    where: {
      slug: params?.category,
    },
    select: {
      name: true,
      imgUrl: true,
      products: true,
      slug: true,
    },
  })

  if (!department) {
    return {
      props: {
        departments,
        products: [],
        department: null,
      },
    }
  }

  return {
    props: {
      departments,
      products: department.products.map(
        ({ createdAt, updatedAt, ...product }) => ({
          ...product,
          createdAt: new Date(createdAt).getTime(),
          updatedAt: new Date(updatedAt).getTime(),
        })
      ),
      department: {
        name: department.name,
        imgUrl: department.imgUrl,
        slug: department.slug,
      },
    },
  }
}
