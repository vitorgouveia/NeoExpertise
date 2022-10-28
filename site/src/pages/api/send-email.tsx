import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case 'POST': {
      const mailDetails = {
        from: process.env.MAIL_USER,
        to: request.body.email,
        subject: 'Redefinir senha',
        text: `
          Nós da NeoExpertise iremos redefinir a sua senha. Entre no link abaixo para redefinir.

          ${request.body.redirect_url}?email=${request.body.email}
        `,
      }

      try {
        await mailTransporter.sendMail(mailDetails)
        return response.json({
          ok: true,
          message: 'Email Sent.',
        })
      } catch (error) {
        const { message } = error as Error

        return response.json({
          ok: false,
          message,
        })
      }
    }
  }
}
