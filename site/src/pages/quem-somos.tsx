import { GetServerSideProps, NextPage } from 'next'
import * as Icons from 'phosphor-react'
import { prisma } from '@/lib/prisma'
import { Contributor } from '@prisma/client'
// @ts-ignore
import Typical from 'react-typical'
import Link from 'next/link'

import { Button } from '@/components/button'
import { styled } from '@/stitches.config'
import { Heading } from '@/components/heading'

const CategoryCoverRoot = styled('section', {
  height: '40vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '$sizes$100',
  background: '$grayDarker',
  padding: '$sizes$800 $sizes$600',

  h1: {
    textAlign: 'center',
  },

  p: {
    color: '$grayLighter',
  },
})

const SectionRoot = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '$sizes$400 $sizes$500',
  gap: '$sizes$400',

  maxWidth: '1600px',
  margin: 'auto',
})

const SectionContentRoot = styled('div', {
  width: '100%',

  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'space-between',

  img: {
    width: '45%',
    maxHeight: '340px',
    objectFit: 'cover',
    aspectRatio: '1/6',
    borderRadius: '$sizes$100',
    border: '1px solid $grayNormal',
  },

  variants: {
    imagePosition: {
      left: {
        flexDirection: 'row',

        '@mobile': {
          flexDirection: 'column-reverse',
        },
      },
      right: {
        flexDirection: 'row-reverse',

        '@mobile': {
          flexDirection: 'column-reverse',
        },
      },
    },
  },

  '@mobile': {
    gap: '$sizes$400',

    img: {
      width: '100%',
    },
  },
})

const SectionDescription = styled('div', {
  width: '45%',

  '@mobile': {
    width: '100%',
  },

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',

  p: {
    color: '$grayLighter',
    textAlign: 'center',
  },
})

const ContributorGrid = styled('div', {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '$sizes$400',
})

const ContributorCard = styled('div', {
  background: '$grayDarker',
  borderRadius: '$sizes$100',
  width: '220px',
  height: '400px',

  padding: '$sizes$200',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',

  img: {
    width: '100%',
    height: '120px',
    borderRadius: '$sizes$100',
    objectFit: 'cover',
  },

  '@mobile': {
    width: '100%',
  },
})

const QuemSomos: NextPage<{
  contributors: Contributor[]
  sections: Array<{
    title: string
    imagePosition: 'right' | 'left'
    img: string
    imageDescription: string
    description: Array<{
      id: string
      text: string
    }>
  }>
}> = ({ contributors, sections }) => {
  return (
    <>
      <CategoryCoverRoot>
        {/* <Heading.paragraph>
          <strong>Sobre a NeoExpertise</strong>
        </Heading.paragraph> */}

        <Heading.subtitle css={{ fontWeight: '$semibold' }}>
          <Typical
            steps={[
              'Nós Somos A Expertise Que O Mercado Precisa',
              3000,
              'Nós Somos A Revolução',
              3000,
              'Nós Somos NeoExpertise',
              3000,
            ]}
            loop={Infinity}
            wrapper="span"
          />
        </Heading.subtitle>
      </CategoryCoverRoot>

      {/* <SectionRoot>
        <Heading.subtitle2>
          O E-Commerce Focado Na Sua Experiência
        </Heading.subtitle2>

        <SectionContentRoot imagePosition="left">
          <img
            src="https://i.ytimg.com/vi/NkCohy3KdQo/maxresdefault.jpg"
            alt=""
          />

          <SectionDescription>
            <Heading.paragraph>
              Fomos criados com a intenção de competir no mercado contra os
              maiores e-commerces relacionados a Hardware no Brasil.
            </Heading.paragraph>
          </SectionDescription>
        </SectionContentRoot>
      </SectionRoot> */}

      {sections?.map(
        ({ title, description, img, imageDescription, imagePosition }) => (
          <SectionRoot css={{ padding: '$sizes$800 $sizes$500' }} key={title}>
            <SectionContentRoot imagePosition={imagePosition}>
              <img src={img} alt={imageDescription} />

              <SectionDescription>
                <Heading.subtitle>
                  <strong>{title}</strong>
                </Heading.subtitle>

                {description.map(({ id, text }) => (
                  <Heading.paragraph key={id}>{text}</Heading.paragraph>
                ))}
              </SectionDescription>
            </SectionContentRoot>
          </SectionRoot>
        )
      )}

      <SectionRoot>
        <Heading.subtitle2>A Nossa Equipe</Heading.subtitle2>

        <ContributorGrid>
          {contributors?.map(
            ({ name, slug, description, imgUrl, imgDescription }) => (
              <ContributorCard key={slug}>
                <img src={imgUrl} alt={imgDescription} />

                <Heading.subtitle3 css={{ textAlign: 'center' }}>
                  <strong>{name}</strong>
                </Heading.subtitle3>

                <Heading.paragraph
                  css={{ textAlign: 'center', color: '$grayLighter' }}
                >
                  {description.split(',').map((role) => (
                    <>
                      {role} <br />
                    </>
                  ))}
                </Heading.paragraph>

                <Link href={`/equipe/${slug}`} passHref>
                  <Button
                    as="a"
                    css={{ width: '100%', borderColor: '$primaryNormal' }}
                    variant="outlined"
                  >
                    <Heading.subtitle3>
                      <strong>Ver Mais</strong>
                    </Heading.subtitle3>
                  </Button>
                </Link>
              </ContributorCard>
            )
          )}
        </ContributorGrid>
      </SectionRoot>
    </>
  )
}

export default QuemSomos
// [
//         {
//           name: 'Alessandro',
//           img: 'https://i.ytimg.com/vi/NkCohy3KdQo/maxresdefault.jpg',
//           imageDescription: 'descrição da foto',
//           slug: 'alessandro',
//           description: 'Documentação',
//         },
//         {
//           name: 'Lucas Lima',
//           img: 'https://i.ytimg.com/vi/NkCohy3KdQo/maxresdefault.jpg',
//           imageDescription: 'descrição da foto',
//           slug: 'lucas',
//           description: 'Documentação',
//         },
//         {
//           name: 'Thiago Thalisson',
//           img: 'https://i.ytimg.com/vi/NkCohy3KdQo/maxresdefault.jpg',
//           imageDescription: 'descrição da foto',
//           slug: 'thiago',
//           description: 'Front-end, Documentação, Lições',
//         },
//         {
//           name: 'Vitor Gouveia',
//           img: 'https://i.ytimg.com/vi/NkCohy3KdQo/maxresdefault.jpg',
//           imageDescription: '',
//           slug: 'vitor-gouveia',
//           description: 'Front-end, Back-end, Documentação',
//         },
//         {
//           name: 'Vitor Mendonça',
//           img: 'https://i.ytimg.com/vi/NkCohy3KdQo/maxresdefault.jpg',
//           imageDescription: '',
//           slug: 'vitor-mendonca',
//           description: 'Documentação, Lições',
//         },
//         {
//           name: 'Vinicius Aquino',
//           img: 'https://i.ytimg.com/vi/NkCohy3KdQo/maxresdefault.jpg',
//           imageDescription: '',
//           slug: 'vinicius',
//           description: 'Documentação, Lições',
//         },
//       ]
export const getServerSideProps: GetServerSideProps = async () => {
  const contributors = await prisma.contributor.findMany({
    select: {
      createdAt: false,
      updatedAt: false,
      name: true,
      description: true,
      slug: true,
      imgUrl: true,
      imgDescription: true,
    },
  })

  return {
    props: {
      sections: [
        {
          title: 'Valores',
          imagePosition: 'right',
          imageDescription: '',
          img: 'https://cdn.pixabay.com/photo/2019/06/06/16/02/technology-4256272_960_720.jpg',
          description: [
            {
              id: '0',
              text: `Prezamos por nossas maiores virtudes e nos comprometeremos em
              todos pequenos detalhes, que não só constituirão um site
              deslumbrante mas uma experiência magnifíca.`,
            },
          ],
        },
        {
          title: 'O Que Fazemos',
          imagePosition: 'left',
          imageDescription: '',
          img: 'https://cdn.pixabay.com/photo/2015/01/08/18/27/startup-593341_960_720.jpg',
          description: [
            {
              id: '0',
              text: `Nós como um grupo nos empenhamos em um site que transmitisse
              profissionalidade e simplicidade e sempre estaremos dispostos em
              melhorá-lo continuamente.`,
            },
          ],
        },
      ],
      contributors,
    },
  }
}
