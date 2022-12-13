import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripeAPI = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

import { prisma } from '@/lib/prisma'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST': {
      try {
        const { line_items, success_url, cancel_url, userId } = request.body

        const items = JSON.parse(line_items) as Array<{
          price_data: {
            unit_amount: number
            product_data: {
              name: string
            }
          },
          quantity: number
        }>

        await Promise.all([items
          .map(({ price_data }) => ({
            productName: price_data.product_data.name,
            price: price_data.unit_amount,
          }))
          .forEach(async ({ productName, price }) => {
            await prisma.order.create({
              data: {
                productName,
                price,
                stauts: "Processando",
                user: {
                  connect: {
                    id: userId
                  }
                }
              }
            })
          })])

        const stripeSession = await stripeAPI.checkout.sessions.create({
          payment_method_types: ['card', 'boleto'],
          mode: 'payment',
          line_items: JSON.parse(line_items),
          success_url,
          cancel_url,
        })

        return response.json({
          url: stripeSession.url,
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
