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
  .query("list-orders", {
    input: z.object({
      id: z.string()
    }),
    async resolve({ ctx, input }) {
      const orders = await ctx.prisma.order.findMany({
        where: {
          user: {
            id: input.id
          }
        }
      })

      return orders
    }
  })
  .query("create-order", {
    input: z.object({
      productName: z.string(),
      price: z.number(),
      email: z.string().email()
    }),
    async resolve({ ctx, input }) {
      const { productName, price, email }  = input

      const user = await ctx.prisma.user.findFirst({
        where: {
          email
        },
        select: {
          id: true
        }
      })

      if(!user) {
        return
      }

      const order = await ctx.prisma.order.create({
        data: {
          productName,
          price,
          stauts: "Processando",
          user: {
            connect: {
              id: user.id
            }
          }
        }
      })

      return order
    }
  })
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
            {
              name: 'Thiago Thalisson',
              href: '/equipe/thiago',
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
      // const computers = await ctx.prisma.computer.findMany()

      // // i need to reorder elements in a way that the element with prop 'isPrimary' is in the middle
      // // it needs to be independent of the array size

      // const primaryComputer = computers.find(
      //   ({ isPrimary }) => isPrimary === true
      // )

      // if (!primaryComputer) {
      //   return computers
      // }

      // const computersWithoutPrimary = computers.filter(
      //   ({ isPrimary }) => isPrimary !== true
      // )

      // const halfwayThrough = Math.floor(computersWithoutPrimary.length / 2)

      // const leftSide = computersWithoutPrimary.slice(0, halfwayThrough)
      // const rightSide = computersWithoutPrimary.slice(
      //   halfwayThrough,
      //   computersWithoutPrimary.length
      // )

      const reorderedComputers = [
        {
          slug: "pc-gamer-player-1",
          name: "PC Gamer P1",
          description: "Pc gamer com combinações de peça com um olhar mais corsa por cima, apenas o top do top no qual os jogadores números um são",
          images: [
            "https://t2.gstatic.com/images?q=tbn:ANd9GcRPyiEPnzBGHVytsxGCgymRhnO-Xx3JWM8-WuS7bi_GZyGqVObL",
            "https://c4.wallpaperflare.com/wallpaper/903/743/683/msi-corsair-gtx980-cablemods-wallpaper-preview.jpg",
            "https://c4.wallpaperflare.com/wallpaper/205/568/855/asus-computer-electronic-gamer-wallpaper-preview.jpg",
            "https://c4.wallpaperflare.com/wallpaper/205/568/855/asus-computer-electronic-gamer-wallpaper-preview.jpg"
          ],
          isPrimary: false,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        },
        {
          slug: "pc-rainbow-gaming",
          name: "PC Gamer INCLUSIVO",
          description: "Para aqueles que são amantes de arco-íris, onde acreditam no leprechaun e em unicórnios mágicos! Desperte a princesa em você!",
          images: [
            "https://i.pinimg.com/564x/29/c5/17/29c5176f1f964325ae472e7a0c635194.jpg",
            "https://i.pinimg.com/564x/da/12/46/da124628f4d9dc0c593a0fd8d92392b5.jpg",
            "https://i.pinimg.com/564x/96/99/88/9699880643dbba2d7edefe90330dfa6b.jpg",
            "https://i.pinimg.com/564x/ae/6d/fd/ae6dfd23d2b20d5d7e9a9c8bfc554bd6.jpg"
          ],
          isPrimary: true,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        },
        {
          slug: "pc-gamer-player-4",
          name: "PC Gamer P4",
          description: " A SUS gaming station, para aqueles que se disfarçam de aliados de um time e esse time desconfia de qualquer um. Aliás não foi uma dos criadores do Among Us.",
          images: [
            "https://c4.wallpaperflare.com/wallpaper/707/916/1023/computer-asus-pc-gaming-technology-wallpaper-preview.jpg",
            "https://c4.wallpaperflare.com/wallpaper/707/916/1023/computer-asus-pc-gaming-technology-wallpaper-preview.jpg",
            "https://c4.wallpaperflare.com/wallpaper/707/916/1023/computer-asus-pc-gaming-technology-wallpaper-preview.jpg",
            "https://c4.wallpaperflare.com/wallpaper/707/916/1023/computer-asus-pc-gaming-technology-wallpaper-preview.jpg"
          ],
          isPrimary: false,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        },
      ]

      return reorderedComputers
    },
  })
  .query("get-products-by-subcategory", {
    input: z.object({
      slug: z.string()
    }),
    async resolve({ ctx, input }) {
      const products = await ctx.prisma.product.findMany({
        where: {
          department: {
            subDepartments: {
              some: {
                slug: input.slug
              }
            }
          }
        }
      })

      console.log(products)
      return []
    }
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
