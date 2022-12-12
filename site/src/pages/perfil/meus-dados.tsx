import { GetServerSideProps, NextPage } from 'next'
import Router, { useRouter } from 'next/router'
import { unstable_getServerSession } from 'next-auth/next'
import { styled } from '@/stitches.config'
import * as Icons from 'phosphor-react'

import { Heading } from '@/components/heading'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { ReactNode, useState } from 'react'
import { Input } from '@/components/input/field'
import { CSS, CSSProperties } from '@stitches/react'
import { Button } from '@/components/button'
import { Switch, SwitchThumb } from '@/components/input/switch'
import { trpc } from '@/lib/trpc'

import { signOut } from "next-auth/react"

const Container = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$sizes$400',

  '@desktop': {
    maxWidth: '1600px',
    margin: 'auto',
    padding: '$sizes$500',

    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
  },
})

const SectionRoot = styled('section', {
  padding: '$sizes$500 0',

  display: 'flex',
  gap: '$sizes$100',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})

const Row = styled('div', {
  display: 'flex',
  alignItems: 'stretch',
  gap: '$sizes$50',
})

const Perfil: NextPage<{ email: string }> = ({ email: initialEmail }) => {
  const { route, push } = useRouter()

  const [emailField, setEmailField] = useState(initialEmail || '')
  const signNewsletter = trpc.useMutation(['toggle-sign-newsletter'])
  const newsLetterStatus = trpc.useQuery([
    'newsletter-status',
    {
      email: emailField,
    },
  ])
  const [hasNewsletter, setHasNewsletter] = useState(true)

  return (
    <>
      <Container css={{ '@desktop': { display: 'none' } }} as="section">
        <StatusBar />
      </Container>

      <Container>
        <Heading.subtitle css={{ textTransform: 'capitalize' }}>
          {route.split('/').at(-1)?.split('-').join(' ')}
        </Heading.subtitle>

        <Section
          title="Confirmar E-mail"
          description="Verifique se o seu e-mail está ou não confirmado, essa medida de
        segurança é importante para que você possa comprar no site."
        >
          <Button
            onClick={() => {
              signOut()
              push("/")
            }}
            css={{
              borderColor: '$grayNormal',
              '&:disabled': { filter: 'opacity(50%)' },
            }}
            variant="outlined"
          >
            Enviar E-mail
          </Button>
        </Section>

        <Section
          title="Sair da sua conta"
          description=""
        >
          <Button
            onClick={() => {}}
            css={{
              borderColor: '$grayNormal',
              '&:disabled': { filter: 'opacity(50%)' },
            }}
            variant="outlined"
          >
            Logout
          </Button>
        </Section>

        <Section
          title="Trocar E-mail"
          description="Perdeu acesso ao seu e-mail atual ou apenas quer mudá-lo? Faça isso por aqui."
        >
          <Row>
            <Input.Root
              css={{ fontSize: '$paragraph', borderWidth: '2px' }}
              type="text"
              placeholder="john.doe@gmail.com"
              value={emailField}
              onChange={(event) => setEmailField(event.target.value)}
            />

            <Button
              onClick={() => {}}
              disabled={
                !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                  emailField
                )
              }
              css={{
                borderColor: '$grayNormal',
                '&:disabled': { filter: 'opacity(50%)' },
              }}
              variant="outlined"
            >
              Usar E-mail
            </Button>
          </Row>
        </Section>

        <Section
          title="Trocar senha"
          description="Para aqueles que precisam de uma senha mais forte (Acredite, você vai precisar)"
        >
          <Row>
            <Button
              onClick={() =>
                Router.push(`/redefinir-senha?email=${emailField}`)
              }
              disabled={
                !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                  emailField
                )
              }
              css={{
                borderColor: '$grayNormal',
                '&:disabled': { filter: 'opacity(50%)' },
              }}
              variant="outlined"
            >
              Redefinir Senha
            </Button>
          </Row>
        </Section>

        <Section
          title="Trocar imagem de perfil"
          description="Escolha uma nova imagem de perfil que será exibida em suas reviews."
        >
          <Row>
            <Button
              onClick={() => {}}
              disabled={
                !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                  emailField
                )
              }
              css={{
                borderColor: '$grayNormal',
                '&:disabled': { filter: 'opacity(50%)' },
              }}
              variant="outlined"
            >
              Selecionar Imagem
            </Button>
          </Row>
        </Section>

        <Section
          title="Assinar newsletter"
          description="Assine nossa newsletter e receba alertas dos mais novos produtos."
        >
          {newsLetterStatus.data?.hasNewsletter ? (
            <Switch
              checked={hasNewsletter}
              onCheckedChange={() => {
                if (
                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                    emailField
                  )
                ) {
                  signNewsletter.mutate({
                    email: emailField,
                  })
                }

                setHasNewsletter(!setHasNewsletter)
              }}
            >
              <SwitchThumb />
            </Switch>
          ) : (
            <Switch
              onCheckedChange={() => {
                if (
                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                    emailField
                  )
                ) {
                  signNewsletter.mutate({
                    email: emailField,
                  })
                }
              }}
            >
              <SwitchThumb />
            </Switch>
          )}
        </Section>
      </Container>
    </>
  )
}

type SectionProps = {
  children: ReactNode
  title: string
  description: string
}

function Section({ children, title, description }: SectionProps) {
  return (
    <SectionRoot>
      <Heading.subtitle3>{title}</Heading.subtitle3>
      <Heading.paragraph css={{ color: '$grayLighter' }}>
        {description}
      </Heading.paragraph>
      {children}
    </SectionRoot>
  )
}

const StatusBarRoot = styled('section', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // padding: '$sizes$200 $sizes$400',
  position: 'relative',

  '@desktop': {
    display: 'none',
  },
})

const BackArrow = styled('a', {
  position: 'absolute',
  left: '0',
})

function StatusBar() {
  const { route } = useRouter()
  return (
    <StatusBarRoot>
      <BackArrow as="button" onClick={() => Router.back()}>
        <Icons.CaretLeft size={24} />
      </BackArrow>

      <Heading.subtitle3 css={{ textTransform: 'capitalize' }}>
        {/* turns route from "/perfil/meus-dados" to "Meus Dados" */}
        {route.split('/').at(-1)?.split('-').join(' ')}
      </Heading.subtitle3>
    </StatusBarRoot>
  )
}

export default Perfil

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      email: session.user?.email,
    },
  }
}
