import * as trpcNext from '@trpc/server/adapters/next'
import * as trpc from '@trpc/server'

import { slugify } from '@/utils/slug'

import { Stripe } from 'stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { hash } from 'bcrypt'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
  typescript: true,
})

async function createContext({ req, res }: trpcNext.CreateNextContextOptions) {
  return {
    req,
    res,
    stripe,
    prisma: prisma!,
  }
}
type Context = trpc.inferAsyncReturnType<typeof createContext>

export const router = trpc
  .router<Context>()
  .query('newsletter-status', {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
        select: {
          hasNewsletter: true,
        },
      })

      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuário não encontrado',
        })
      }

      return user
    },
  })
  .mutation('toggle-sign-newsletter', {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
        select: {
          hasNewsletter: true,
        },
      })

      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuário não encontrado',
        })
      }

      await ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          hasNewsletter: !user.hasNewsletter,
        },
      })
    },
  })
  .mutation('set-password', {
    input: z.object({
      email: z.string(),
      password: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
        select: {
          email: true,
          password: true,
        },
      })

      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuário não encontrado',
        })
      }

      await ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          password: input.password,
        },
      })

      return {
        ok: true,
      }
    },
  })
  .query('user-details', {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      })

      return user
    },
  })
  .query('get-image', {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
        select: {
          image: true,
        },
      })

      return user?.image
    },
  })
  .mutation('update-image', {
    input: z.object({
      email: z.string().email(),
      url: z.string(),
    }),
    async resolve({ input }) {
      await prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          image: input.url,
        },
      })
    },
  })
  .mutation('create-account', {
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const userAlreadyExists = await prisma.user.findFirst({
        where: {
          email: input.email,
        },
      })

      if (userAlreadyExists) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'Usuário com e-mail já existe.',
        })
      }

      const { name, email, password } = input

      const hashedPassword = await hash(password, 10)

      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })
    },
  })
  .query('find-products', {
    async resolve({ ctx }) {
      return ctx.prisma.product.findMany()
    },
  })
  .query('find-category-by-slug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input, ctx }) {
      const category = await ctx.prisma.department.findUnique({
        where: {
          slug: input.slug,
        },
      })

      if (!category) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'Category not found',
        })
      }

      return category
    },
  })
  .query('footer-topics', {
    async resolve({ ctx }) {
      return [
        {
          name: 'Contato E Institucional',
          pages: [
            {
              name: 'Quem Somos',
              href: '/quem-somos',
            },
            {
              name: 'FAQ',
              href: '/FAQ',
            },
          ],
        },
        {
          name: 'Contribuidores',
          pages: [
            {
              name: 'Vitor Gouveia',
              href: '/equipe/vitor-gouveia',
            },
          ],
        },
        {
          name: 'Links Úteis',
          pages: [
            {
              name: 'Esqueci a Senha',
              href: '/esqueci-a-senha',
            },
            {
              name: 'Perfil',
              href: '/perfil',
            },
            {
              name: 'Catálogo',
              href: '/catalogo',
            },
          ],
        },
      ]
    },
  })
  .query('count-departments', {
    async resolve({ ctx }) {
      return await ctx.prisma.department.count()
    },
  })
  .query('departments', {
    async resolve({ ctx, input }) {
      // order by most sold products
      const departments = await ctx.prisma.department.findMany({
        orderBy: {
          soldProducts: 'desc',
        },
      })

      return departments
    },
  })
  .query('most-famous-products', {
    async resolve({ ctx }) {
      return await ctx.prisma.product.findMany({
        orderBy: [
          {
            rating: 'desc',
          },
          {
            sold: 'desc',
          },
        ],
      })
    },
  })
  .query('most-famous-departments', {
    input: z
      .object({
        take: z.number(),
        skip: z.number(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const take = input?.take || 3
      const skip = input?.skip || 0

      const departments = await ctx.prisma.department.findMany({
        orderBy: {
          soldProducts: 'desc',
        },
        include: {
          products: {
            orderBy: {
              sold: 'desc',
            },
            take: 5,
          },
        },
        take,
        skip,
      })

      return departments
    },
  })
  .query('brands', {
    async resolve({ ctx }) {
      const brands = await ctx.prisma.brand.findMany()

      return brands
    },
  })
  .query('build-your-pc-computer-list', {
    async resolve({ ctx }) {
      const computers = await ctx.prisma.computer.findMany()

      // i need to reorder elements in a way that the element with prop 'isPrimary' is in the middle
      // it needs to be independent of the array size

      const primaryComputer = computers.find(
        ({ isPrimary }) => isPrimary === true
      )

      if (!primaryComputer) {
        return computers
      }

      const computersWithoutPrimary = computers.filter(
        ({ isPrimary }) => isPrimary !== true
      )

      const halfwayThrough = Math.floor(computersWithoutPrimary.length / 2)

      const leftSide = computersWithoutPrimary.slice(0, halfwayThrough)
      const rightSide = computersWithoutPrimary.slice(
        halfwayThrough,
        computersWithoutPrimary.length
      )

      const reorderedComputers = [...leftSide, primaryComputer, ...rightSide]

      return reorderedComputers
    },
  })
  .query('get-homepage-slides', {
    async resolve({ ctx }) {
      // const items = await ctx.prisma.product.findMany({
      //   take: 5,
      // })

      const products = await ctx.prisma.product.findMany({
        take: 3,
      })

      const formattedProducts = products.map(
        ({ id, name, slug, description, images }) => ({
          id,
          name,
          slug,
          description: description ?? '',
          rating: 4,
          coverUrl: images[0],
        })
      )

      return formattedProducts
    },
  })

export type AppRouter = typeof router

export const TRPCNext = trpcNext.createNextApiHandler({
  router,
  createContext,
})
