import React from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import classNames from 'classnames'
import { CaretDownIcon } from '@radix-ui/react-icons'

import { FaGamepad } from 'react-icons/fa/index.js'
import { BiHeadphone } from 'react-icons/bi/index.js'

import { styled } from '@/stitches.config'

const ListItemLink = styled('a', {
  color: '$grayLightest',
  display: 'flex',
  // justifyContent: 'center',
  gap: '1rem',
  alignItems: 'center',
  outline: 'none',
  textDecoration: 'none',
  userSelect: 'none',
  padding: '12px',
  borderRadius: '6px',
  fontSize: '15px',
  lineHeight: '1',

  '&:focus': {
    boxShadow: '0 0 0 2px var(--violet7)',
  },
  '&:hover': {
    backgroundColor: '$grayNormal',
  },
})

const NavigationMenuName = styled('p', {
  color: '$grayLightest',
})

const NavigationWrapper = styled('div', {
  backgroundColor: '$grayDarkest',
})

const NavigationMenuDemo = () => {
  return (
    <NavigationMenu.Root className="NavigationMenuRoot">
      <NavigationMenu.List className="NavigationMenuList">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="NavigationMenuTrigger">
            <NavigationMenuName>Departamentos</NavigationMenuName>
            <CaretDownIcon className="CaretDown" aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="NavigationMenuContent">
            <ul className="List one">
              <ul>
                <ListItemLink href="/hardware">
                  <FaGamepad
                    style={{
                      width: '25px',
                      height: '25px',
                    }}
                  />
                  Hardware
                </ListItemLink>
                <ListItemLink href="/cpu">Processadores</ListItemLink>
                <ListItemLink href="/graphics-card">
                  Placas De Vídeo
                </ListItemLink>
                <ListItemLink href="/motherboards">Placas-Mãe</ListItemLink>
                <ListItemLink href="/memorys">Memórias</ListItemLink>
                <ListItemLink href="/hard-storage">
                  Unidade De Armazenamento
                </ListItemLink>
                <ListItemLink href="/power-supplys">Fontes</ListItemLink>
              </ul>

              <ul>
                <ListItemLink href="/peripherals">
                  <BiHeadphone
                    style={{
                      width: '25px',
                      height: '25px',
                    }}
                  />
                  Periféricos E Acessórios
                </ListItemLink>
                <ListItemLink href="/cpu">Fones De Ouvido</ListItemLink>
                <ListItemLink href="/keyboards">Teclado</ListItemLink>
                <ListItemLink href="/mouses">Mouses</ListItemLink>
              </ul>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="NavigationMenuLink"
            href="/quem-somos"
          >
            <NavigationMenuName>Quem Somos</NavigationMenuName>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className="NavigationMenuLink" href="/faq">
            <NavigationMenuName>Suporte</NavigationMenuName>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Indicator className="NavigationMenuIndicator">
          <div className="Arrow" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="ViewportPosition">
        <NavigationWrapper>
          <NavigationMenu.Viewport className="NavigationMenuViewport" />
        </NavigationWrapper>
      </div>
    </NavigationMenu.Root>
  )
}

// eslint-disable-next-line react/display-name
const ListItem = React.forwardRef(
  ({ className, children, title, ...props }, forwardedRef) => (
    <li>
      <NavigationMenu.Link asChild>
        <a
          className={classNames('ListItemLink', className)}
          {...props}
          href={forwardedRef}
        >
          <div className="ListItemHeading">{title}</div>
          <p className="ListItemText">{children}</p>
        </a>
      </NavigationMenu.Link>
    </li>
  )
)

export default NavigationMenuDemo
