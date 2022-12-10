import * as Icons from 'phosphor-react'

import { trpc } from '@/lib/trpc'
import { styled } from '@/stitches.config'

import { Heading } from '@/components/heading'
import { Logo } from './icons/logo'
import { Icon } from './header'
import Link from 'next/link'

const DEFAULT_ICON_SIZE = 28

const FooterRoot = styled('footer', {
  width: '100%',
  // maxWidth: '1600px',

  margin: '0 auto',
  padding: '$sizes$600 $sizes$500',

  display: 'none',

  '@tablet': {
    display: 'flex',
  },

  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '$sizes$400',
})

const FooterTop = styled('div', {
  width: '100%',

  display: 'flex',
  gap: '$sizes$1000',
})

const FooterBottom = styled('div', {
  display: 'flex',
  gap: '$sizes$100',
})

const FooterTopics = styled('div', {
  width: '100%',

  display: 'flex',
  gap: '$sizes$400',
})

const Topic = styled('div', {})

const FooterDivider = styled('hr', {
  width: '100%',
  borderColor: '$primaryNormal',
})

const LogoRoot = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$sizes$50',
})

const SocialMediaList = styled('div', {
  width: '100%',

  display: 'flex',
  alignItems: 'center',
  gap: '$sizes$100',

  a: {
    aspectRatio: 1,
    width: 'auto',
    height: '40px',
  },
})

export const Footer = () => {
  const { data: topics, isLoading } = trpc.useQuery(['footer-topics'])

  if (isLoading) {
    return (
      <div>
        <h1>isloading...</h1>
      </div>
    )
  }

  return (
    <FooterRoot>
      <FooterTop>
        <LogoRoot>
          <Logo />
          <Heading.subtitle css={{ fontWeight: '$light' }}>
            <strong>Neo</strong>Expertise
          </Heading.subtitle>
        </LogoRoot>

        <SocialMediaList>
          <Icon
            href={'www.instagram.com'}
            target="_blank"
            rel="noreferrer"
            as="a"
          >
            <Icons.InstagramLogo size={DEFAULT_ICON_SIZE} />
          </Icon>
          <Icon
            href={'www.facebook.com'}
            target="_blank"
            rel="noreferrer"
            as="a"
          >
            <Icons.FacebookLogo size={DEFAULT_ICON_SIZE} />
          </Icon>
          <Icon
            href={'www.twitter.com'}
            target="_blank"
            rel="noreferrer"
            as="a"
          >
            <Icons.TwitterLogo size={DEFAULT_ICON_SIZE} />
          </Icon>
        </SocialMediaList>
      </FooterTop>

      <FooterDivider />

      <FooterBottom>
        <FooterTopics>
          {topics?.map(({ name, pages }) => (
            <Topic key={name}>
              <Heading.subtitle3>{name}</Heading.subtitle3>

              <ul>
                {pages.map(({ name: pageName, href }) => (
                  <li key={href}>
                    <Link href={href} passHref>
                      <Heading.paragraph as="a" css={{ color: '$grayLighter' }}>
                        {pageName}
                      </Heading.paragraph>
                    </Link>
                  </li>
                ))}
              </ul>
            </Topic>
          ))}
        </FooterTopics>
      </FooterBottom>
    </FooterRoot>
  )
}
