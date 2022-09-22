import { GetServerSideProps, NextPage } from 'next'
import { UserCircle } from 'phosphor-react'
import type { Session } from 'next-auth'
import { unstable_getServerSession } from 'next-auth/next'
import { styled } from '@/stitches.config'
import { useState } from 'react'

import { prisma } from '@/lib/prisma'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input/field'
import { Switch, SwitchThumb } from '@/components/input/switch'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const Container = styled('main', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const Perfil: NextPage<{ session: Session }> = ({ session }) => {
  const [keepSession, setKeepSession] = useState(false)

  return (
    <Container>
      <UserCircle size={100} />

      <Heading.subtitle>Entre Com Sua Conta</Heading.subtitle>

      <Heading.paragraph>Entre Com Sua Conta</Heading.paragraph>

      <Input.Root
        aria-label="Email"
        type="email"
        placeholder="john.doe@gmail.com"
      />

      <Input.Root
        aria-label="Senha"
        type="password"
        placeholder="john.doe@gmail.com"
      />

      <section>
        <Switch id="session-switcher" defaultChecked={keepSession}>
          <SwitchThumb />
        </Switch>

        <Heading.paragraph>Manter a minha sessão</Heading.paragraph>
      </section>
    </Container>
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
      session,
    },
  }
}
