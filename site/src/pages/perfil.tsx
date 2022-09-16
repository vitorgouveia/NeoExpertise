import { GetServerSideProps, NextPage } from 'next'
import type { Session } from 'next-auth'
import { unstable_getServerSession } from 'next-auth/next'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const Perfil: NextPage<{ session: Session }> = ({ session }) => {
  return <div>{session?.user?.name}</div>
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
