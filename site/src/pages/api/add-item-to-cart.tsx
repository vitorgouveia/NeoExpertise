import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST': {
      try {
        const { email, productId } = request.body

        const productAlreadyExistsInCart = await prisma.user.findFirst({
          where: {
            cart: {
              some: {
                id: productId,
              },
            },
          },
        })

        if (productAlreadyExistsInCart) {
          return response.status(500).json({
            ok: false,
            message: 'Produto já está no seu carrinho!',
          })
        }

        await prisma.user.update({
          where: {
            email,
          },
          data: {
            cart: {
              connect: {
                id: productId,
              },
            },
          },
        })

        return response.json({
          ok: true,
        })
      } catch (error) {
        console.log(error)
        return response.status(500).json({
          ok: false,
        })
      }
    }
    default: {
      return response.status(404).end()
    }
  }
}
