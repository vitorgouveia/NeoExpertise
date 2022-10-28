import { NextPage } from 'next'
import Router, { useRouter } from 'next/router'
import Link from 'next/link'
import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import { EnvelopeOpen, GoogleLogo } from 'phosphor-react'
import { styled } from '@/stitches.config'
import { useState } from 'react'

import { signIn } from 'next-auth/react'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input/field'
import { Button } from '@/components/button'
import { CSSProperties } from '@stitches/react'
import { trpc } from '@/lib/trpc'

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

const Perfil: NextPage = () => {
  const [password, setPassword] = useState('')
  const [formErrorMessage, setFormErrorMessage] = useState('')

  const setUserPassword = trpc.useMutation(['set-password'])

  const router = useRouter()

  return (
    <Container>
      <Heading.subtitle>Redefinir Senha</Heading.subtitle>

      <Heading.paragraph
        css={{ fontWeight: '400', color: '$grayLighter', textAlign: 'center' }}
      >
        Insira uma nova senha para a sua conta
      </Heading.paragraph>

      {formErrorMessage && (
        <Heading.subtitle3
          css={{ textAlign: 'center', color: '$dangerNormal' }}
        >
          {formErrorMessage}
        </Heading.subtitle3>
      )}

      <Input.WithLabel
        style={InputStyles.root}
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="***************"
      >
        <Input.Label>
          <div style={InputStyles.label}>
            <Heading.subtitle3>Senha</Heading.subtitle3>
          </div>
        </Input.Label>
      </Input.WithLabel>

      <Button
        variant="outlined"
        css={{ width: '100%', borderColor: '$grayNormal' }}
        onClick={async () => {
          if (!password) {
            setFormErrorMessage('Preencha o campo')
            return
          }

          if (!router.query.email) {
            return
          }

          try {
            setUserPassword.mutate(
              {
                email: String(router.query.email),
                password,
              },
              {
                onError: (error) => setFormErrorMessage(error.message),
                onSuccess: () => {
                  alert('Senha atualizada com sucesso!')
                  Router.push('/perfil')
                },
              }
            )
          } catch (error) {
            console.error(error)
            setFormErrorMessage(
              'Alguma coisa deu errado, tente novamente mais tarde.'
            )
          }
        }}
      >
        <Heading.subtitle3>Recuperar Senha</Heading.subtitle3>
      </Button>
    </Container>
  )
}

export default Perfil
