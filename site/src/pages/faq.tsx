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
    li: {
      // width: '300px',
    },
  },
})

const Card = styled('li', {
  maxWidth: '700px',
  height: 'auto',

  borderRadius: '$sizes$100',
  backgroundColor: '$grayDarker',
  padding: '$sizes$300',
  gap: '$sizes$200',

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

            <p dangerouslySetInnerHTML={{ __html: description }} className="dim" />
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
            ` - Para efetuar compras em nosso site, basta escolher o produto que deseja e clicar em "Comprar". <br>
              Alguns produtos poderão ter variações de cor e tamanho. Nestes casos, você deverá selecionar sempre, antes de clicar em comprar, as opções que melhor se adaptam ao seu caso;<br>
              - Escolhido o produto e clicado em "Comprar", você será direcionado para o Carrinho de Compras. Confira se o produto e o valor estão de acordo com o item que você escolheu. Estando de acordo, informe seu CEP e clique em "Calcular" para calcularmos o custo do seu frete. Escolha uma das opções de frete e clique em "Fechar Pedido";<br>
              - O próximo passo é a página de identificação, onde serão solicitados seus dados cadastrais. Se for a sua primeira compra, você será direcionado para a página de cadastro. Se já for nosso cliente, entre com o login e senha e em seguida escolha o endereço de entrega do seu pedido;<br>
              - O pagamento é a última etapa da sua compra. Confira portanto se todos os dados da sua compra estão corretos (produtos, quantidade, preço, endereço de entrega). Caso alguma informação esteja errada, altere o seu pedido.
            `,
        },
        {
          id: '2',
          name: 'Prazos E Entregas',
          description:
            `Todos os produtos serão enviados de acordo com a forma escolhida pelo cliente, muito bem embalados para evitar qualquer tipo de dano durante o transporte. O prazo para a entrega é influenciado por dois fatores:<br>
              <br>
              1) De acordo com a forma de envio escolhida, já que a entrega fica a cargo dos Correios ou Transportadora.<br>
              <br>
              2) De acordo com a disponibilidade do produto em estoque, o prazo de postagem (não considera prazo de entrega) de cada produto está informado no campo disponibilidade, no anúncio do mesmo.<br>
              <br>
              3) A NeoExpertise não realiza entregas para Caixa Postal em nenhuma hipótese, caso não seja observado este termo, e informado uma Caixa Postal para envio, o pedido será retido e o Atendimento entrará em contato com o cliente, podendo ocasionar atrasos no envio conforme dificuldade de contato.
            `,
        },
        {
          id: '3',
          name: 'Formas De Pagamento',
          description:
            `Trabalhamos com diversas formas de pagamento<br>
            - Todas as formas de pagamento e prazos não consideram Sábados, Domingos e feriados. Se sua compra for feita após as 18:00Hrs, considere contagem do prazo no dia útil seguinte. CARTÃO DE CRÉDITO Opção ideal para parcelar suas compras em até 12x sem juros.<br>
            - O prazo para processamento de compras por cartão de crédito leva de 1 até 3 dias úteis, quando o cartão está no mesmo nome do comprador. OBSERVAÇÃO Compras com cartões de terceiros o prazo poderá ser estendido conforme necessidade de tempo para confirmação da compra.<br>
            - Pagamentos via cartão de crédito estão sujeitos a verificação cadastral de segurança de acordo com normas estabelecidas pelas operadoras de cartões de crédito. Compras com cartão estão sujeitas a solicitação de documentos para comprovação de dados.<br>
            - Não efetuamos envios para Caixa Postal ou posta restante em nenhuma circunstância com pagamentos via cartão de crédito. Compras com cartões de terceiros estão sujeitas a conferência de endereço de entrega. Nos reservamos o direito de cancelar o pedido em caso de divergências cadastrais.<br>
            - TODAS AS COMPRAS FEITAS COM CARTÃO ESTÃO SUJEITA A ANALISE.`,
        },
      ],
    },
  }
}
