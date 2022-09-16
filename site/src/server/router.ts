import * as trpcNext from '@trpc/server/adapters/next'
import * as trpc from '@trpc/server'

import { slugify } from '@/utils/slug'

import { Stripe } from 'stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
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
          name: 'Tópico 1',
          pages: [
            {
              name: 'Pagina 1',
              href: '/page1',
            },
            {
              name: 'Pagina 2',
              href: '/page2',
            },
            {
              name: 'Pagina 3',
              href: '/page3',
            },
            {
              name: 'Pagina 4',
              href: '/page4',
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
      const take = input?.take || 2
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

      const { data: products } = await ctx.stripe.products.list()

      const formattedProducts = products.map(
        ({ id, name, description, images }) => ({
          id,
          name,
          slug: slugify(name),
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
