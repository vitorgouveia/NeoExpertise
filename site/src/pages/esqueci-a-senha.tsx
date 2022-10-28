import { NextPage } from 'next'
import Router from 'next/router'
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
  const [emailSent, setEmailSent] = useState(false)

  const [email, setEmail] = useState('')
  const [formErrorMessage, setFormErrorMessage] = useState('')

  return emailSent ? (
    <Container>
      <EnvelopeOpen size={100} weight="thin" />
      <Heading.subtitle>E-mail enviado.</Heading.subtitle>

      <Heading.paragraph
        css={{ fontWeight: '400', color: '$grayLighter', textAlign: 'center' }}
      >
        Olhe a sua caixa de entrada
      </Heading.paragraph>
    </Container>
  ) : (
    <Container>
      <Heading.subtitle>Esqueceu a senha?</Heading.subtitle>

      <Heading.paragraph
        css={{ fontWeight: '400', color: '$grayLighter', textAlign: 'center' }}
      >
        Por favor, preencha o campo abaixo com o seu endereço de email para que
        possamos ajudá-lo
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

      <Button
        variant="outlined"
        css={{ width: '100%', borderColor: '$grayNormal' }}
        onClick={async () => {
          if (!email) {
            setFormErrorMessage('Preencha o campo')
            return
          }

          try {
            const response = await fetch('/api/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                redirect_url: `${window.location.origin}/redefinir-senha`,
                email,
              }),
            })

            const data = await response.json()

            console.log(data)
            if (data.ok !== true) {
              console.error(data)
              setFormErrorMessage(
                'Alguma coisa deu errado, tente novamente mais tarde.'
              )
              return
            }

            setEmailSent(true)
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
