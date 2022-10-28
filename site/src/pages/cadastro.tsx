import { NextPage } from 'next'
import Router from 'next/router'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import { UserCircle, GoogleLogo } from 'phosphor-react'
import { styled } from '@/stitches.config'
import { useCallback, useState } from 'react'

import { signIn } from 'next-auth/react'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input/field'
import { Button } from '@/components/button'
// import { Switch, SwitchThumb } from '@/components/input/switch'
// import { BuiltInProviderType } from 'next-auth/providers'
import { CSSProperties } from '@stitches/react'

const Container = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  gap: '$sizes$300',

  width: '100%',
  padding: '$sizes$900',

  '@desktop': {
    padding: '$sizes$300',

    width: '600px',
    margin: '0 auto',
  },
})

const Section = styled('section', {
  width: '100%',

  display: 'flex',
  alignItems: 'center',
  gap: '$sizes$300',
})

const InputStyles: Record<string, CSSProperties> = {
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}

const SocialButtons = styled(Button, {
  border: 'none',
  background: '$grayDarker',
  padding: '$sizes$200',
  width: '100%',

  '&:hover': {
    background: '$grayNormal',
  },

  '&:focus-visible': {
    outlineOffset: '3px',
    outline: '3px solid $grayNormal',
  },
})

const SOCIAL_LOGIN_LOGO_SIZE = 24

// type Providers = BuiltInProviderType

const Perfil: NextPage = () => {
  const createAccount = trpc.useMutation(['create-account'])
  // const [keepSession, setKeepSession] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrorMessage, setFormErrorMessage] = useState('')

  const handleCreateAccount = useCallback(async () => {
    createAccount.mutate(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: async () => {
          const response = await signIn('credentials', {
            email,
            password,
            redirect: true,
            callbackUrl: '/perfil',
          })
        },
      }
    )
  }, [createAccount, email, name, password])

  return (
    <Container>
      <UserCircle size={100} weight="thin" />

      <Heading.subtitle>Crie A Sua Conta</Heading.subtitle>

      <Heading.subtitle2
        css={{ fontWeight: '400', color: '$grayLighter', textAlign: 'center' }}
      >
        E Experience O Melhor Do E-Commerce De Jogos
      </Heading.subtitle2>

      {createAccount.error && (
        <Heading.subtitle3
          css={{ textAlign: 'center', color: '$dangerNormal' }}
        >
          {createAccount.error.message}
        </Heading.subtitle3>
      )}

      {formErrorMessage && (
        <Heading.subtitle3
          css={{ textAlign: 'center', color: '$dangerNormal' }}
        >
          {formErrorMessage}
        </Heading.subtitle3>
      )}

      <Input.WithLabel
        style={InputStyles.root}
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Fulano de Tal"
      >
        <Input.Label>
          <div style={InputStyles.label}>
            <Heading.subtitle3>Nome Completo</Heading.subtitle3>
          </div>
        </Input.Label>
      </Input.WithLabel>

      <Input.WithLabel
        style={InputStyles.root}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="john.doe@gmail.com"
      >
        <Input.Label>
          <div style={InputStyles.label}>
            <Heading.subtitle3>E-mail</Heading.subtitle3>
          </div>
        </Input.Label>
      </Input.WithLabel>

      <Input.WithLabel
        style={InputStyles.root}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        placeholder="*******************"
      >
        <Input.Label>
          <div style={InputStyles.label}>
            <Heading.subtitle3>Senha</Heading.subtitle3>
            <Link href="/esqueci-a-senha" passHref>
              <a>
                <Heading.paragraph>
                  <strong>Esqueci a senha</strong>
                </Heading.paragraph>
              </a>
            </Link>
          </div>
        </Input.Label>
      </Input.WithLabel>

      <Button
        variant="outlined"
        css={{ width: '100%', borderColor: '$grayNormal' }}
        onClick={handleCreateAccount}
      >
        <Heading.subtitle3>Entre na NeoExpertise</Heading.subtitle3>
      </Button>

      <Section css={{ flexDirection: 'column' }}>
        <Heading.paragraph>Ou Crie Com:</Heading.paragraph>

        <Section
          css={{
            width: '100%',
            '@desktop': { width: '70%', margin: '0 auto' },
          }}
        >
          <SocialButtons
            onClick={async () => {
              const response = await signIn('discord', {
                redirect: true,
                callbackUrl: '/',
              })

              if (response?.error) {
                return setFormErrorMessage(
                  'Algo deu errado, tente novamente mais tarde'
                )
              }
            }}
          >
            <DiscordLogoIcon
              width={SOCIAL_LOGIN_LOGO_SIZE}
              height={SOCIAL_LOGIN_LOGO_SIZE}
            />
          </SocialButtons>

          <SocialButtons
            onClick={async () => {
              const response = await signIn('github', {
                redirect: true,
                callbackUrl: '/',
              })

              if (response?.error) {
                return setFormErrorMessage(
                  'Algo deu errado, tente novamente mais tarde'
                )
              }
            }}
          >
            <GitHubLogoIcon
              width={SOCIAL_LOGIN_LOGO_SIZE}
              height={SOCIAL_LOGIN_LOGO_SIZE}
            />
          </SocialButtons>

          <SocialButtons
            onClick={async () => {
              const response = await signIn('google', {
                redirect: true,
                callbackUrl: '/',
              })

              if (response?.error) {
                return setFormErrorMessage(
                  'Algo deu errado, tente novamente mais tarde'
                )
              }
            }}
          >
            <GoogleLogo weight="bold" size={SOCIAL_LOGIN_LOGO_SIZE} />
          </SocialButtons>
        </Section>
      </Section>

      <Link href="/login" passHref>
        <Heading.paragraph
          as={'a'}
          css={{ display: 'flex', gap: '$sizes$100' }}
        >
          Já tem conta?
        </Heading.paragraph>
      </Link>
    </Container>
  )
}

export default Perfil
