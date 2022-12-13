import { GetServerSideProps, NextPage } from 'next'
import {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import Flag from 'react-country-flag'
import Router, { useRouter } from 'next/router'
import Link from 'next/link'
import { unstable_getServerSession } from 'next-auth/next'
import { styled, theme as baseTheme } from '@/stitches.config'
import { PencilSimple, IconProps } from 'phosphor-react'
import * as Icons from 'phosphor-react'

import { languages } from '@/lib/languages'
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
import { Heading } from '@/components/heading'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Button } from '@/components/button'
import { Input } from '@/components/input/field'
import Modal, { ModalHandles } from '@/components/modal'
import { useOnClickOutside } from '@/components/header/use-on-click-outside'
import { trpc } from '@/lib/trpc'
import { prisma } from '@/lib/prisma'
import { Switch, SwitchThumb } from '@/components/input/switch'
import { ThemeContext } from '@/components/theme-context'

const DEFAULT_ICON_SIZE = 28

const Container = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$sizes$400',

  '@desktop': {
    maxWidth: '1600px',
    margin: 'auto',
    padding: '$sizes$500',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
})

const BackgroundImageRoot = styled('div', {
  display: 'none',

  '@desktop': {
    display: 'block',
    width: '100%',
    height: '50vh',
    maxHeight: '400px',

    position: 'relative',
  },
})

const EditButton = styled(Button, {
  position: 'absolute',
  $$pencilMargin: '$sizes$200',
  right: '$$pencilMargin',
  bottom: '$$pencilMargin',

  padding: '$sizes$100 !important',
  borderRadius: '$sizes$50',

  cursor: 'pointer',

  background: 'transparent',
})

const EditBackgroundModal = styled('div', {
  width: 'fit-content',
  height: 'fit-content',

  padding: '$sizes$300',
  borderRadius: '$sizes$50',

  background: '$grayDarkest',
  border: '2px solid $grayNormal',

  zIndex: 40,

  position: 'absolute',
  inset: 0,
  margin: 'auto',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$sizes$400',
})

const configurations: Configuration[] = [
  {
    name: 'Meus Dados',
    description: 'Trocar e-mail, ver sessões, trocar senha, confirmar e-mail.',
    icon: Icons.Database,
    link: '/perfil/meus-dados',
  },
  {
    name: 'Pagamentos',
    description: 'Adicione métodos de pagamento, visualize todas as compras',
    icon: Icons.Wallet,
    link: '/perfil/pagamentos',
  },
  {
    name: 'Endereços',
    description: 'Adicione endereços',
    icon: Icons.House,
    link: '/perfil/enderecos',
  },
  {
    name: 'Privacidade',
    description: 'Ocultar nome e foto de perfil',
    icon: Icons.FingerprintSimple,
    link: '/perfil/privacidade',
  },
  {
    name: 'Tema & Acessibilidade',
    description: 'Altere o tema, aumente a fonte',
    icon: Icons.Wheelchair,
    link: '/perfil/acessibilidade',
  },
]

const Perfil: NextPage<{
  name: string
  email: string
  createdAt: string
}> = ({ name, email, createdAt }) => {
  // prettier-ignore
  const userDetails = trpc.useQuery(["user-details", {
    email
  }])

  return (
    <>
      <Container css={{ '@desktop': { display: 'none' } }} as="section">
        <StatusBar />
      </Container>

      {email && <BackgroundImage email={email} />}
      <Container
        as="section"
        css={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          '@desktop': {
            alignItems: 'center',
            justifyContent: 'flex-end',
          },
        }}
      >
        {userDetails.isLoading ? null : (
          <UserCard
            name={name}
            profileImage={userDetails.data?.image}
            createdAt={String(createdAt)}
          />
        )}
      </Container>

      <Container>
        <Configurations configurations={configurations} />

        <MobileConfigurations configurations={configurations} />
        {/* <Button
          onClick={async () => {
            signOut({
              redirect: false,
            })

            await Router.push('/')
          }}
          css={{ background: '$dangerNormal' }}
        >
          Logout
        </Button> */}
      </Container>
    </>
  )
}

type BackgroundImageProps = {
  email: string
}

function BackgroundImage({ email }: BackgroundImageProps) {
  const modalRef = useRef<ModalHandles>(null)
  const modalContainerRef = useRef<HTMLDivElement>(null)
  const [newBackground, setNewBackground] = useState('')
  const [error, setError] = useState('')
  const updateImage = trpc.useMutation(['update-image'])
  const getImage = trpc.useQuery([
    'get-image',
    {
      email,
    },
  ])

  useOnClickOutside(modalContainerRef, () => {
    modalRef.current?.close()
  })

  return (
    <>
      <BackgroundImageRoot
        style={
          getImage.data
            ? {
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',

                backgroundImage: `linear-gradient(
                  to bottom,
                  rgba(0, 0, 0, 0),
                  rgba(0, 0, 0, 1)
                ), url("${getImage.data}")`,
              }
            : {
                background: baseTheme.colors['grayNormal'].value,
              }
        }
      >
        {!updateImage.isLoading && (
          <EditButton onClick={() => modalRef.current?.open()}>
            <PencilSimple size={32} />
          </EditButton>
        )}
      </BackgroundImageRoot>

      <Modal ref={modalRef} visible={false}>
        <EditBackgroundModal ref={modalContainerRef}>
          <Heading.subtitle3>Troque a imagem de fundo</Heading.subtitle3>

          {error && (
            <Heading.paragraph css={{ color: '$dangerNormal' }}>
              {error}
            </Heading.paragraph>
          )}

          <Input.Root
            css={{ width: '100%', fontSize: '$paragraph' }}
            placeholder="cole qualquer link JPG"
            value={newBackground}
            onChange={(event) => setNewBackground(event.target.value)}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="default"
              css={{ '&:hover': {} }}
              onClick={async () => {
                setError('')

                const isJPG =
                  newBackground.includes('.jpg') ||
                  newBackground.includes('.jpeg')

                if (!isJPG || !newBackground) {
                  setError('A imagem precisa ser um JPG')
                  return
                }

                updateImage.mutate({
                  email,
                  url: newBackground,
                })

                modalRef.current?.close()
                Router.reload()
              }}
            >
              Trocar Fundo
            </Button>

            <Button
              variant="default"
              css={{
                border: 'none',
                background: '$dangerNormal',
                '&:hover': { background: '$dangerLighter' },
              }}
              onClick={() => {
                setError('')
                modalRef.current?.close()
              }}
            >
              Fechar Modal
            </Button>
          </div>
        </EditBackgroundModal>
      </Modal>
    </>
  )
}

const UserCardRoot = styled('section', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$sizes$200',

  '@desktop': {
    position: 'absolute',
    transform: 'translateY(-25%)',
    left: '0px',
  },
})

const UserProfileImage = styled('img', {
  $$imageSize: '100px',
  width: '$$imageSize',
  height: '$$imageSize',
  borderRadius: '50%',
  border: '2px solid $primaryNormal',
})

const Details = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$sizes$100',
})

type UserCardProps = {
  name: string
  profileImage: string | null | undefined
  createdAt: string
}

function UserCard({ name, profileImage, createdAt }: UserCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString()

  return (
    <UserCardRoot>
      <UserProfileImage
        src={
          profileImage ||
          `https://avatars.dicebear.com/api/initials/${name}.svg`
        }
        alt={`Imagem de perfil do usuário ${name}`}
      />

      <Details>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heading.subtitle3>{name}</Heading.subtitle3>
          <Heading.paragraph css={{ color: '$grayLighter' }}>
            <strong>{name}#9432</strong>
          </Heading.paragraph>
        </div>

        <Heading.paragraph css={{ color: '$grayLighter' }}>
          entrou em: <strong>{formattedDate}</strong>
        </Heading.paragraph>
      </Details>
    </UserCardRoot>
  )
}

const ColumnsContainer = styled('section', {
  display: 'none',

  '@desktop': {
    paddingTop: '$sizes$800',

    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 1fr',
    gap: '$sizes$400',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
})

const SmallColumn = styled('div', {
  width: 'max-content',
})

const LargeColumn = styled('div', {
  width: '100%',
})

const ConfigCard = styled('a', {
  width: '100%',

  display: 'flex',
  alignItems: 'center',
  gap: '$sizes$200',

  background: '$grayDarker',
  borderRadius: '$sizes$100',
  border: '2px solid $grayNormal',
  padding: '$sizes$200',
  position: 'relative',

  '&:hover, &:focus': {
    borderColor: '$primaryNormal',
    outline: 'none',
  },
})

const ConfigIcon = styled('div', {
  padding: '$sizes$200',
  borderRadius: '50%',
  border: '2px solid $grayNormal',

  svg: {
    color: '$grayLighter',
  },
})

const ArrowLink = styled('div', {
  position: 'absolute',
  right: '$sizes$200',

  color: '$grayLighter',
})

type Configuration = {
  name: string
  description: string
  link: string
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
}

type ConfigurationsProps = {
  configurations: Configuration[]
}

function Configurations({ configurations }: ConfigurationsProps) {
  return (
    <ColumnsContainer>
      <SmallColumn>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {configurations.map(({ name, link }) => (
            <li key={link}>
              <Link href={link} passHref>
                <Heading.paragraph as="a">
                  <strong>{name}</strong>
                </Heading.paragraph>
              </Link>
            </li>
          ))}
        </ul>
      </SmallColumn>

      <LargeColumn>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {configurations.map(({ name, description, link, icon: Icon }) => (
            <li key={link}>
              <Link href={link} passHref>
                <ConfigCard>
                  <ConfigIcon>
                    <Icon size={48} weight="thin" />
                  </ConfigIcon>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <Heading.subtitle3>{name}</Heading.subtitle3>
                    <Heading.paragraph
                      css={{ color: '$grayLighter', fontWeight: '$light' }}
                    >
                      {description}
                    </Heading.paragraph>
                  </div>

                  <ArrowLink>
                    <Icons.ArrowRight size={24} />
                  </ArrowLink>
                </ConfigCard>
              </Link>
            </li>
          ))}
        </ul>
      </LargeColumn>

      <SmallColumn></SmallColumn>
    </ColumnsContainer>
  )
}

const MobileConfigRoot = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$sizes$800',
})

const MobileConfigSection = styled('section', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '$sizes$200',

  '@desktop': {
    display: 'none',
  },
})

const MobileConfigItem = styled('a', {
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  borderBottom: '1px solid $grayNormal',
  gap: '$sizes$100',
  color: '$grayLighter',
  position: 'relative',

  padding: '$sizes$100 0',

  p: {
    width: 'max-content',
  },

  '&:hover, &:focus': {
    borderColor: '$primaryNormal',
  },
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

function MobileConfigurations({ configurations }: ConfigurationsProps) {
  const [hydrated, setHydrated] = useState(false)
  const { setTheme, themeClass, themes } = useContext(ThemeContext)

  const [language, setLanguage] = useState('PT-BR')

  useEffect(() => {
    // This forces a rerender, so the date is rendered
    // the second time but not the first
    setHydrated(true)
  }, [])

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null
  }

  return (
    <MobileConfigRoot>
      <MobileConfigSection>
        <Heading.subtitle3 css={{ fontWeight: '$light' }}>
          Geral
        </Heading.subtitle3>

        <ul
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {configurations.map(({ name, link }) => (
            <li style={{ width: '100%' }} key={name}>
              <Link href={link} passHref>
                <MobileConfigItem>
                  <Heading.paragraph css={{ color: '$grayLighter' }}>
                    {name}
                  </Heading.paragraph>

                  <ArrowLink>
                    <Icons.CaretRight size={24} />
                  </ArrowLink>
                </MobileConfigItem>
              </Link>
            </li>
          ))}
        </ul>
      </MobileConfigSection>

      <MobileConfigSection>
        <Heading.subtitle3 css={{ fontWeight: '$light' }}>
          Acessibilidade
        </Heading.subtitle3>

        <ul
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <li style={{ width: '100%' }}>
            <MobileConfigItem
              as="section"
              css={{ alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() =>
                setTheme(
                  themeClass === themes.waterLightning.className
                    ? themes.evoAvenger
                    : themes.waterLightning
                )
              }
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Icons.MoonStars size={24} />
                <Heading.paragraph css={{ color: '$grayLighter' }}>
                  Modo Escuro
                </Heading.paragraph>
              </div>

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
            </MobileConfigItem>
          </li>

          <li style={{ width: '100%' }}>
            <MobileConfigItem
              css={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Icons.GlobeSimple size={24} />
                <Heading.paragraph css={{ color: '$grayLighter' }}>
                  Linguagem
                </Heading.paragraph>
              </div>

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
            </MobileConfigItem>
          </li>
        </ul>
      </MobileConfigSection>
    </MobileConfigRoot>
  )
}

const StatusBarRoot = styled('section', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // padding: '$sizes$200 $sizes$400',
  position: 'relative',

  '@desktop': {
    display: 'none',
  },
})

const BackArrow = styled('a', {
  position: 'absolute',
  left: '0',
})

function StatusBar() {
  const { route } = useRouter()

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1)

  return (
    <StatusBarRoot>
      <BackArrow as="button" onClick={() => Router.back()}>
        <Icons.CaretLeft size={24} />
      </BackArrow>

      <Heading.subtitle3>
        {/* turns route from "/perfil" to "Perfil" */}
        {capitalizeFirstLetter(route.replace('/', ''))}
      </Heading.subtitle3>
    </StatusBarRoot>
  )
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

  const userInfo = await prisma.user.findFirst({
    where: {
      email: session.user!.email,
    },
    select: {
      createdAt: true,
    },
  })

  return {
    props: {
      name: session.user!.name,
      email: session.user!.email,
      createdAt: String(userInfo?.createdAt),
    },
  }
}
