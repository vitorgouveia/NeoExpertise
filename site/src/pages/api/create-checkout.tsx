import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripeAPI = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST': {
      try {
        const { line_items, success_url, cancel_url } = request.body

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
