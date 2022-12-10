import { GetServerSideProps, NextPage } from 'next'
import { prisma } from '@/lib/prisma'
import * as Icons from 'phosphor-react'
import Fuse from 'fuse.js'

import { styled } from '@/stitches.config'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input/field'
import { useState } from 'react'

const SearchBar = styled(Input.Root, {
  width: '437px',
  height: '43px',
  padding: '$sizes$100 $sizes$200',
  border: '1px solid $grayNormal',
  background: '$grayDarkest',
  fontSize: '$paragraph',

  '@mobile': {
    width: '380px',
  },
})

const CategoryCoverRoot = styled('section', {
  height: '40vh',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '$sizes$100',

  h1: {
    textAlign: 'center',
  },
})

const CardList = styled('ul', {
  maxWidth: '1600px',
  margin: '0 auto',
  padding: '$sizes$600 $sizes$200',

  flex: 1,

  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  gap: '$sizes$200',

  justifyContent: 'center',
  li: {
    width: '100%',
  },

  '@tablet': {
    justifyContent: 'center',

    li: {
      // width: '300px',
    },
  },

  '@desktop': {
    justifyContent: 'flex-start',
  },
})

const Card = styled('li', {
  // width: '300px',
  height: 'auto',

  borderRadius: '$sizes$100',
  backgroundColor: '$grayDarker',
  padding: '$sizes$300',
  gap: '$sizes$300',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',

  '.dim': {
    color: '$grayLighter',
  },
})

type Card = {
  id: string
  name: string
  description: string
}

const FAQ: NextPage<{ cards: Card[] }> = ({ cards: virtualCards }) => {
  const [cards, setCards] = useState(virtualCards)
  const [searchString, setSearchString] = useState('')

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
            url("https://theme.zdassets.com/theme_assets/678183/b7e9dce75f9edb23504e13b4699e208f204e5015.png")
          `,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Heading.title>Está Com Alguma Dúvida?</Heading.title>

        <SearchBar
          value={searchString}
          onChange={(event) => {
            setSearchString(event.target.value)

            if (event.target.value === '') {
              setCards(virtualCards)
              return
            }

            const fuzzy = new Fuse(cards, {
              keys: ['name', 'description'],
            })

            const sortedCards = fuzzy.search(event.target.value)
            setCards(sortedCards.map(({ item }) => item))
          }}
          placeholder="Pesquise a sua dúvida aqui"
        />
      </CategoryCoverRoot>

      <CardList>
        {cards?.map(({ id, name, description }) => (
          <Card key={id}>
            <Heading.subtitle3>
              <strong>{name}</strong>
            </Heading.subtitle3>

            <Heading.paragraph className="dim">{description}</Heading.paragraph>
          </Card>
        ))}
      </CardList>
    </>
  )
}

export default FAQ

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      cards: [
        {
          id: '1',
          name: 'Como Fazer Compras?',
          description:
            '- Para fazer compras na NeoExpertise procure pelo seu produto ou o selecione em nossa página de produto e clique em "Comprar" ou no ícone de carrinho ao lado.\naaaaA',
        },
        {
          id: '2',
          name: 'Shopee',
          description: 'bruh what the hell bruh',
        },
        {
          id: '3',
          name: 'YummyYummy',
          description: 'yiiiii',
        },
      ],
    },
  }
}
