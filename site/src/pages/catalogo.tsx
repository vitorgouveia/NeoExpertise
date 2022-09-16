import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { trpc } from '@/lib/trpc'
import { prisma } from '@/lib/prisma'
import { styled } from '@/stitches.config'
import { Heading } from '@/components/heading'
import { Department, SubDepartment } from '@prisma/client'
import { FunctionComponent } from 'react'
import { CSS } from '@stitches/react'

const Container = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '$sizes$200',

  width: '100%',
  maxWidth: '1600px',
  margin: '0 auto',
  padding: '$sizes$500',
})

const DepartmentsGrid = styled('section', {
  width: '100%',
  height: '400px',
  overflow: 'auto',

  display: 'flex',

  '> a': {
    width: '600px',
    maxWidth: 'none',
    height: '100%',
    gridArea: 'none',
  },

  // '@desktop': {
  //   height: '60vh',
  //   maxHeight: '500px',
  //   display: 'grid',
  //   gridTemplateAreas: `
  //     "category-0 category-1"
  //     "category-0 category-2"
  //     "category-0 category-2"
  //   `,
  //   gap: '$sizes$200',

  //   '> *': {
  //     width: '100%',
  //   },
  // },
})

const DepartmentCardRoot = styled('a', {
  // width: '100%',
  // height: '100%',

  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',

  borderRadius: '$sizes$100',
  border: '2px solid $grayNormal',
  padding: '$sizes$300',

  transition: 'all 250ms',

  '&:focus-visible': {
    outlineOffset: '4px',
    outline: '4px solid $primaryDarker',
  },

  '&:hover, &:focus': {
    borderColor: '$primaryNormal',
  },
})

const DepartmentTitle = styled('section', {
  display: 'flex',
  alignItems: 'center',
  gap: '$sizes$200',
})

const DepartmentList = styled('ul', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '$sizes$200',
  justifyContent: 'flex-start',
  overflow: 'auto',

  li: {
    flex: 1,
    height: '100%',
  },
})

const DepartmentCard: FunctionComponent<{
  slug: string
  name: string
  imgUrl: string
  css?: CSS
}> = ({ name, slug, css, imgUrl }) => {
  return (
    <Link key={slug} href={`/${slug}`} passHref>
      <DepartmentCardRoot
        css={{
          ...css,
          backgroundPosition: 'center',
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url("${imgUrl}")`,
        }}
      >
        <DepartmentTitle>
          <Heading.subtitle2>{name}</Heading.subtitle2>
          <Heading.paragraph css={{ color: '$grayLighter' }}>
            Ver produtos
          </Heading.paragraph>
        </DepartmentTitle>
      </DepartmentCardRoot>
    </Link>
  )
}

const Catalogo: NextPage<{
  departments: (Department & {
    subDepartments: SubDepartment[]
  })[]
}> = ({ departments }) => {
  const { data: mostFamousDepartments } = trpc.useQuery([
    'most-famous-departments',
    {
      take: 3,
      skip: 0,
    },
  ])

  const { data: departmentList } = trpc.useQuery([
    'most-famous-departments',
    {
      take: 10,
      skip: 3,
    },
  ])

  return (
    <Container>
      <Heading.subtitle>Catálogo</Heading.subtitle>

      <DepartmentsGrid>
        {mostFamousDepartments?.map((props, index) => (
          <DepartmentCard
            {...props}
            key={props.slug}
            css={{
              gridArea: `category-${index}`,
            }}
          />
        ))}
      </DepartmentsGrid>

      {(departmentList?.length || 0) > 0 && (
        <DepartmentList>
          {departmentList?.map((props) => (
            <li key={props.slug}>
              <DepartmentCard
                css={{ aspectRatio: '1/1', height: 'auto' }}
                {...props}
              />
            </li>
          ))}
        </DepartmentList>
      )}

      {departments?.map(({ name, slug, subDepartments }) => (
        <Container as="section" css={{ padding: 0 }} key={slug}>
          <Link href={`/${slug}`} passHref>
            <a>
              <DepartmentTitle>
                <Heading.subtitle2>{name}</Heading.subtitle2>
                <Heading.paragraph css={{ color: '$grayLighter' }}>
                  ver mais
                </Heading.paragraph>
              </DepartmentTitle>
            </a>
          </Link>

          {subDepartments.length > 0 && (
            <DepartmentList css={{ height: '300px' }}>
              {subDepartments.map((subDepartment) => (
                <li
                  style={{ minWidth: '300px !important' }}
                  key={subDepartment.slug}
                >
                  <Link
                    key={subDepartment.slug}
                    href={`/${subDepartment.slug}`}
                    passHref
                  >
                    <DepartmentCardRoot
                      css={{
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        backgroundPosition: 'center',
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url("${subDepartment.imgUrl}")`,
                      }}
                    >
                      <Heading.subtitle3 css={{ textAlign: 'center' }}>
                        {subDepartment.name}
                      </Heading.subtitle3>
                    </DepartmentCardRoot>
                  </Link>
                </li>
              ))}
            </DepartmentList>
          )}
        </Container>
      ))}
    </Container>
  )
}

export default Catalogo

export const getServerSideProps: GetServerSideProps = async () => {
  const departments = await prisma.department.findMany({
    select: {
      subDepartments: {
        select: {
          name: true,
          slug: true,
          imgUrl: true,
          createdAt: false,
          updatedAt: false,
        },
      },
      name: true,
      imgUrl: true,
      slug: true,
      createdAt: false,
      updatedAt: false,
    },
  })

  return {
    props: {
      departments,
    },
  }
}
