import {
  FunctionComponent,
  ReactNode,
  useContext,
  useState,
  useRef,
} from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Flag from 'react-country-flag'

import { languages } from '@/lib/languages'
import type { CSS } from '@stitches/react'
import * as Icons from 'phosphor-react'
import { CaretDownIcon } from '@radix-ui/react-icons'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import NavigationMenuDemo from './radix-navigation'

import { Switch, SwitchThumb } from '@/components/input/switch'
import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from './scroll-area'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectContent,
  SelectScrollDownButton,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectScrollUpButton,
  SelectSeparator,
  SelectViewport,
} from '@/components/input/select'

import { ThemeContext } from '@/components/theme-context'
import { styled, keyframes, theme as baseTheme } from '@/stitches.config'
import { Logo } from '@/components/icons/logo'
import { Input } from '@/components/input/field'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'

import { useOnClickOutside } from './use-on-click-outside'
import { useSession } from 'next-auth/react'

type HeaderProps = {
  categories: Array<{
    name: string
    href: string
  }>
}

const HeaderRoot = styled('header', {
  // position: 'fixed',
  zIndex: '39',
  // top: 0,

  width: '100%',
  margin: 'auto',
  padding: '$sizes$100 $sizes$300',
  background: '$grayDarker',
  borderBottom: '2px solid $primaryNormal',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  '@tablet': {
    padding: '$sizes$100 $sizes$300',
    background: '$grayDarkest',
    gap: '$sizes$200',

    section: {
      gap: '$sizes$100',
    },
  },
  '@mobile': {
    padding: '$sizes$100 $sizes$100',
    background: '$grayDarkest',
    gap: '$sizes$100',
    border: 'none',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',

    section: {
      width: 'max-content',
    },
  },
})

const Navigation = styled('nav', {
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$sizes$200',

  '@desktop': {
    display: 'flex',
  },
})

const NavigationItem = styled('a', {
  // fontWeight: 'bold',
  cursor: 'pointer',
  borderRadius: '$sizes$50',
  fontSize: '$paragraph',

  // padding: '0px 5px',
  // paddingBottom: '4px',

  strong: {
    verticalAlign: 'baseline',
    lineHeight: '10px',
  },

  color: '$grayLightest',

  '&:hover, &:focus': {
    color: '$grayLighter',
  },

  '&:focus': {
    outline: '2px solid $grayLighter',
  },
})

const SearchBar = styled(Input.Root, {
  width: '100%',
  height: '32px',
  border: '1px solid $grayNormal',

  '@desktop': {
    display: 'none',
  },
})

const defaultSectionWidth = '300px'

const Section = styled('section', {
  width: defaultSectionWidth,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '$sizes$100',

  '@tablet': {
    justifyContent: 'center',
  },
})

export const Icon = styled('a', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$sizes$50',
  padding: 'calc($sizes$50 / 1.2)',

  '@mobile': {
    width: '32px',
    height: '32px',
    flexShrink: 0,
  },

  cursor: 'pointer',

  color: '$grayLighter',
  transition: 'all 250ms',

  svg: {
    '@mobile': {
      width: '16px',
      height: '16px',
    },

    color: 'inherit',
    transition: 'inherit',
  },

  '&:focus-visible': {
    outlineOffset: '2px',
    outline: '2px solid $grayNormal',
  },

  '&:hover, &:focus': {
    color: '$grayLightest',
    background: '$grayNormal',
  },
})

const HamburgerMenu = styled(Icon, {
  '@mobile': {
    border: '1px solid $grayNormal',
    color: '$grayLightest',
  },

  '@desktop': {
    display: 'none',
  },
})

const SearchIcon = styled(Icon, {
  display: 'none',

  '@desktop': {
    display: 'flex',
  },
})

const ThemeIcon = styled(Icon, {
  display: 'none',

  '@desktop': {
    display: 'flex',
  },
})

const UserIcon = styled(Icon, {
  display: 'none',

  '@tablet': {
    display: 'flex',
  },
})

const StyledCaret = styled(CaretDownIcon, {
  position: 'relative',
  color: 'inherit',
  top: 1,
  '[data-state=open] &': { transform: 'rotate(-180deg)' },
  '@media (prefers-reduced-motion: no-preference)': {
    transition: 'transform 350ms ease !important',
  },
})

const DropdownStyledSeparator = styled(DropdownMenuPrimitive.Separator, {
  height: 1,
  backgroundColor: '$grayNormal',
  margin: 5,
})

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
})

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
})

const StyledContent = styled(DropdownMenuPrimitive.Content, {
  minWidth: '110px',
  display: 'flex',
  flexDirection: 'column',
  gap: '$sizes$50',
  padding: '$sizes$50',

  backgroundColor: '$grayDarker',
  border: '2px solid $grayNormal',

  borderRadius: 'calc($sizes$50 / 2)',
  position: 'relative',
  // boxShadow:
  //   '0px 10px 38px -10px rgba(22, 23, 24, 0.75), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
})

// const StyledArrow = styled(DropdownMenuPrimitive.Arrow, {
//   fill: '$grayNormal',
// })

const Content: FunctionComponent<{ children: ReactNode; css?: CSS }> = ({
  children,
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <StyledContent {...props}>
        {children}

        {/* <StyledArrow /> */}
      </StyledContent>
    </DropdownMenuPrimitive.Portal>
  )
}

const StyledItem = styled(DropdownMenuPrimitive.Item, {
  all: 'unset',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space',

  borderRadius: 'calc($sizes$50 / 2)',
  padding: 'calc($sizes$50 / 2) $sizes$50',

  color: '$grayLighter',

  // position: 'relative',
  userSelect: 'none',
  cursor: 'pointer',
  transition: 'all 250ms',

  '&[data-disabled]': {
    color: '$grayNormal',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    backgroundColor: '$grayNormal',
    color: '$grayLightest',
  },
})

const DropdownMenu = styled(DropdownMenuPrimitive.Root, {
  transform: 'none !important',
})
const UserDropdownMenu = styled(DropdownMenu, {
  display: 'none',

  '@desktop': {
    display: 'flex',
    gap: '1rem',
  },
})

const LanguageDropdownMenu = styled(DropdownMenu, {
  display: 'none',

  '@tablet': {
    display: 'flex',
  },
})
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuContent = Content
const DropdownMenuItem = StyledItem

// adjust this size based on the screen

const LeftSlot = styled('div', {
  display: 'grid',
  placeItems: 'center',

  marginRight: '$sizes$50',
  color: 'inherit',
  '[data-highlighted] > &': { color: 'white' },
  '[data-disabled] &': { color: '$grayDarker' },
})

const RightSlot = styled('div', {
  display: 'grid',
  placeItems: 'center',

  marginLeft: 'auto',
  paddingLeft: '$sizes$100',
  color: 'inherit',
  '[data-highlighted] > &': { color: 'white' },
  '[data-disabled] &': { color: '$grayDarker' },
})

const MobileMenuRoot = styled('div', {
  position: 'fixed',
  display: 'flex',
  flexDirection: 'column',

  overflow: 'auto',

  width: '360px',
  height: '100vh',

  // position: 'absolute',
  top: '0px',
  left: '0px',

  zIndex: 20,

  transition: 'all 250ms',

  variants: {
    variant: {
      visible: {
        visibility: 'visible',
        opacity: 1,
        transform: 'translate(0, 0)',
      },
      invisible: {
        visibility: 'hidden',
        opacity: 0,
        transform: 'translate(-100%, 0)',
      },
    },
  },

  '@desktop': {
    display: 'none',
  },
})

const MobileMenuNavigation = styled('ul', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$grayDarkest',
  padding: '$sizes$300',
  gap: '$sizes$200',
})

const MobileMenuItem = styled(Icon, {
  width: '100%',
  height: '46px',
  justifyContent: 'flex-start',
  gap: '$sizes$100',
  padding: '$sizes$100',
  alignItems: 'center',

  'svg, svg *': {
    color: 'inherit',
    transition: 'none !important',
  },

  '&:hover, &:focus': {
    color: '$primaryNormal',
  },

  '&:focus-visible': {
    outlineOffset: '2px',
    color: '$grayLighter',
    outline: '2px solid $grayNormal',
  },
})

const DEFAULT_ICON_SIZE = 28

const MobileAuth = styled('div', {
  backgroundColor: '$grayDarker',
  display: 'flex',
  flexDirection: 'column',
  gap: '$sizes$200',
  padding: '$sizes$300',
})

const mobileMenuItems = [
  {
    icon: Icons.House,
    name: 'Home',
    type: 'link',
    href: '/home',
  },
  {
    icon: Icons.MagnifyingGlass,
    name: 'Buscar',
    type: 'link',
    href: '/search',
  },
  {
    icon: Icons.Handbag,
    name: 'Minhas compras',
    type: 'link',
    href: '/profile/orders',
  },
  {
    icon: Icons.Star,
    name: 'Favoritos',
    type: 'link',
    href: '/profile/favorites',
  },
  {
    icon: Icons.Clock,
    name: 'Histórico',
    type: 'link',
    href: '/profile/history',
  },
  {
    icon: Icons.UserCircle,
    name: 'Minha conta',
    type: 'link',
    href: '/profile',
  },
  {
    icon: Icons.Headset,
    name: 'Ajuda',
    type: 'link',
    href: '/help',
  },
]

export const Header: FunctionComponent<HeaderProps> = ({ categories }) => {
  const { data } = useSession()

  const { setTheme, themes, theme, themeClass } = useContext(ThemeContext)
  const [language, setLanguage] = useState('PT-BR')
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)
  const [isAuthDropdownMenuOpen, setIsAuthDropdownMenuOpen] = useState(false)
  const mobileMenu = useRef<HTMLDivElement>(null)

  useOnClickOutside(mobileMenu, () => {
    setIsMobileModalOpen(false)

    if (typeof window !== 'undefined') {
      document.body.classList.remove('mobile-menu-overlay')
    }
  })

  return (
    <HeaderRoot>
      {/* <Section>
        <Icon
          tabIndex={0}
          target="_blank"
          href="https://www.facebook.com"
          rel="noreferrer"
        >
          <Icons.FacebookLogo size={DEFAULT_ICON_SIZE} />
        </Icon>

        <Icon
          tabIndex={0}
          target="_blank"
          href="https://www.instagram.com"
          rel="noreferrer"
        >
          <Icons.InstagramLogo size={DEFAULT_ICON_SIZE} />
        </Icon>

        <Icon
          tabIndex={0}
          target="_blank"
          href="https://www.twitter.com"
          rel="noreferrer"
        >
          <Icons.TwitterLogo size={DEFAULT_ICON_SIZE} />
        </Icon>
      </Section> */}

      <HamburgerMenu
        as="button"
        tabIndex={0}
        onClick={() => {
          document.body.classList.toggle('mobile-menu-overlay')

          setIsMobileModalOpen((state) => !state)
        }}
      >
        <Icons.List size={DEFAULT_ICON_SIZE} />
      </HamburgerMenu>

      <MobileMenuRoot
        variant={isMobileModalOpen ? 'visible' : 'invisible'}
        ref={mobileMenu}
      >
        <MobileAuth>
          <Section
            style={{
              width: '100%',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: '$sizes$200',
            }}
            as="main"
          >
            {/* <Icons.UserCircle
                  weight="thin"
                  style={{ flexShrink: 0 }}
                  // color={baseTheme.colors['grayLighter'].value}
                  size={DEFAULT_ICON_SIZE}
                /> */}
            <Section
              css={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0px',
              }}
            >
              <Heading.subtitle2
                css={{ color: '$grayLightest', fontSize: '$paragraph' }}
              >
                Entre Na Sua Conta
              </Heading.subtitle2>
              <Heading.paragraph
                css={{ color: '$grayLighter', fontSize: '$small' }}
              >
                Entre na sua conta e experiencie o melhor de e-commerce de
                hardware no brasil.
              </Heading.paragraph>
            </Section>
          </Section>
          <Button as="button" css={{ '&:focus': { background: 'red' } }}>
            Entrar
          </Button>
        </MobileAuth>

        <MobileMenuNavigation>
          {mobileMenuItems.map(({ name, href, icon: ItemIcon }) => (
            <li key={href}>
              <Link href={href} passHref>
                <MobileMenuItem>
                  {ItemIcon && (
                    <ItemIcon
                      style={{
                        flexShrink: 0,
                        width: '20px !important',
                        height: '20px !important',
                      }}
                      size={24}
                    />
                  )}

                  <Heading.subtitle3 css={{ fontSize: '$small' }}>
                    {name}
                  </Heading.subtitle3>
                </MobileMenuItem>
              </Link>
            </li>
          ))}

          <DropdownStyledSeparator />

          <li>
            <MobileMenuItem
              as="label"
              htmlFor="toggle-theme-switcher"
              style={{ justifyContent: 'space-between' }}
            >
              <Section css={{ width: 'max-content' }} as="div">
                <Icons.MoonStars
                  style={{
                    flexShrink: 0,
                    width: '20px !important',
                    height: '20px !important',
                  }}
                  size={24}
                />

                <Heading.subtitle3 css={{ fontSize: '$small' }}>
                  Modo Escuro
                </Heading.subtitle3>
              </Section>

              <Switch
                id="toggle-theme-switcher"
                onCheckedChange={() =>
                  setTheme(
                    themeClass === themes.waterLightning.className
                      ? themes.evoAvenger
                      : themes.waterLightning
                  )
                }
                checked={
                  themeClass === themes.waterLightning.className ? false : true
                }
              >
                <SwitchThumb />
              </Switch>
            </MobileMenuItem>
          </li>
          <li>
            <MobileMenuItem
              as="label"
              style={{ justifyContent: 'space-between' }}
            >
              <Section css={{ width: 'max-content' }} as="div">
                <Icons.Globe
                  style={{
                    flexShrink: 0,
                    width: '20px !important',
                    height: '20px !important',
                  }}
                  size={24}
                />

                <Heading.subtitle3 css={{ fontSize: '$small' }}>
                  Linguagem
                </Heading.subtitle3>
              </Section>

              <Select
                onValueChange={(value) => setLanguage(value)}
                value={language}
              >
                <SelectTrigger aria-label="Language">
                  <SelectValue placeholder="Select a language" />

                  <Flag
                    style={{ fontSize: DEFAULT_ICON_SIZE / 2 }}
                    countryCode={
                      languages.find(({ name }) => name === language)
                        ?.countryCode!
                    }
                  />

                  <SelectIcon>
                    <Icons.CaretDown />
                  </SelectIcon>
                </SelectTrigger>

                <SelectContent css={{ zIndex: '40' }}>
                  <SelectScrollUpButton>
                    <Icons.CaretUp />
                  </SelectScrollUpButton>
                  <SelectViewport data-cancel-click-outside>
                    <SelectGroup data-cancel-click-outside>
                      {languages.map(({ name, countryCode }) => (
                        <SelectItem
                          key={name}
                          value={name}
                          data-cancel-click-outside
                        >
                          <SelectItemText data-cancel-click-outside>
                            {name}
                          </SelectItemText>
                          <RightSlot data-cancel-click-outside>
                            <Flag
                              countryCode={countryCode}
                              data-cancel-click-outside
                            />
                          </RightSlot>
                          <SelectItemIndicator data-cancel-click-outside>
                            <Icons.Check />
                          </SelectItemIndicator>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectViewport>
                  <SelectScrollDownButton>
                    <Icons.CaretDown />
                  </SelectScrollDownButton>
                </SelectContent>
              </Select>
            </MobileMenuItem>
          </li>

          <DropdownStyledSeparator />

          {categories.map(({ name, href }) => (
            <li key={href}>
              <Link href={href} passHref>
                <MobileMenuItem>
                  <Heading.subtitle3 css={{ fontSize: '$small' }}>
                    {name}
                  </Heading.subtitle3>
                </MobileMenuItem>
              </Link>
            </li>
          ))}
        </MobileMenuNavigation>
      </MobileMenuRoot>

      {/* <SearchBar /> */}

      <Navigation>
        <Link href="/" passHref>
          <Icon
            css={{
              padding: '4px',
              path: {
                transition: 'all 250ms',
              },
              '&:hover, &:focus': {
                path: {
                  fill: '$grayLightest',
                },
              },
            }}
            tabIndex={0}
          >
            <Logo />
          </Icon>
        </Link>
        <NavigationMenuDemo></NavigationMenuDemo>

        {/* {categories.map((props) => (
          <NavItem key={props.name} {...props} />
        ))} */}
      </Navigation>

      <Section css={{ justifyContent: 'flex-end' }}>
        {/* <SearchIcon tabIndex={0} as="button">
          <Icons.MagnifyingGlass size={DEFAULT_ICON_SIZE} />
        </SearchIcon> */}

        {data?.user ? (
          <Link href="/perfil" passHref>
            <UserIcon tabIndex={0} as="a">
              <img
                style={{ borderRadius: '50%' }}
                src={`https://avatars.dicebear.com/api/initials/${data?.user?.name}.svg`}
                alt=""
                width={DEFAULT_ICON_SIZE}
                height={DEFAULT_ICON_SIZE}
              />
              {/* <Icons.User size={DEFAULT_ICON_SIZE} /> */}
            </UserIcon>
          </Link>
        ) : (
          <UserDropdownMenu
            open={isAuthDropdownMenuOpen}
            onOpenChange={(open) => setIsAuthDropdownMenuOpen(open)}
          >
            <DropdownMenuTrigger asChild>
              <UserIcon tabIndex={0} as="button">
                <Icons.User size={DEFAULT_ICON_SIZE} />
              </UserIcon>
            </DropdownMenuTrigger>

            <DropdownMenuContent css={{ zIndex: '40' }}>
              <DropdownMenuItem onSelect={() => Router.push('/login')}>
                <Section css={{ width: 'max-content' }}>
                  <Icons.SignIn size={DEFAULT_ICON_SIZE} />
                  Entrar
                </Section>
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => Router.push('/cadastro')}>
                <Section css={{ width: 'max-content' }}>
                  <Icons.UserPlus size={DEFAULT_ICON_SIZE} />
                  Criar Conta
                </Section>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </UserDropdownMenu>
        )}

        <Icon
          css={{
            '@mobile': {
              border: '1px solid $grayNormal',
              color: '$grayLightest',
            },
          }}
          tabIndex={0}
          href="/checkout"
        >
          <Icons.ShoppingCart size={DEFAULT_ICON_SIZE} />
        </Icon>

        <LanguageDropdownMenu
          open={isLanguageModalOpen}
          onOpenChange={(open) => setIsLanguageModalOpen(open)}
        >
          <DropdownMenuTrigger asChild>
            <Icon
              css={{
                gap: 'calc($sizes$50 / 2)',
                p: { color: 'inherit', transition: 'inherit' },
                '@mobile': {
                  border: '1px solid $grayNormal',
                  color: '$grayLightest',
                },
              }}
              as="button"
            >
              <Icons.Flag size={DEFAULT_ICON_SIZE} />

              {languages.find(({ name }) => name === language) && (
                <Flag
                  style={{ fontSize: DEFAULT_ICON_SIZE / 1.5 }}
                  countryCode={
                    languages.find(({ name }) => name === language)
                      ?.countryCode!
                  }
                />
              )}

              <StyledCaret
                width={DEFAULT_ICON_SIZE}
                height={DEFAULT_ICON_SIZE}
                aria-hidden
              />
            </Icon>
          </DropdownMenuTrigger>

          <DropdownMenuContent css={{ zIndex: 100 }}>
            {languages.map(({ name, countryCode }) =>
              language === name ? (
                <DropdownMenuItem
                  key={name}
                  aria-checked={language === name}
                  data-highlighted={language === name}
                  onClick={(event) => {
                    event.preventDefault()

                    setLanguage(name)
                  }}
                >
                  <LeftSlot>
                    <Icons.Check
                      weight="bold"
                      color={baseTheme.colors['grayLightest'].value}
                      style={{ opacity: language === name ? 1 : 0 }}
                      size={DEFAULT_ICON_SIZE / 1.2}
                    />
                  </LeftSlot>
                  <strong>{name}</strong>
                  <RightSlot>
                    <Flag countryCode={countryCode} />
                  </RightSlot>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  key={name}
                  onClick={(event) => {
                    event.preventDefault()

                    setLanguage(name)
                  }}
                >
                  <LeftSlot>
                    <Icons.Check
                      style={{ opacity: language === name ? 1 : 0 }}
                      size={DEFAULT_ICON_SIZE / 1.2}
                    />
                  </LeftSlot>
                  <strong>{name}</strong>
                  <RightSlot>
                    <Flag countryCode={countryCode} />

                    {language === name && (
                      <Icons.Check size={DEFAULT_ICON_SIZE / 1.2} />
                    )}
                  </RightSlot>
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </LanguageDropdownMenu>

        <ThemeIcon
          tabIndex={0}
          as="button"
          onClick={() =>
            setTheme(
              themeClass === themes.waterLightning.className
                ? themes.evoAvenger
                : themes.waterLightning
            )
          }
        >
          {theme === themes.waterLightning ? (
            <Icons.SunHorizon size={DEFAULT_ICON_SIZE} />
          ) : (
            <Icons.MoonStars size={DEFAULT_ICON_SIZE} />
          )}
        </ThemeIcon>
      </Section>
    </HeaderRoot>
  )
}

function NavItem({ name, href }: { name: string; href: string }) {
  return (
    <Link href={href} passHref>
      <NavigationItem tabIndex={0}>{name}</NavigationItem>
    </Link>
  )
}
// for lazy loading
export default Header
