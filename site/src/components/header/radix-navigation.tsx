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
                <ListItemLink href="/hardware-e-peças">
                  <FaGamepad
                    style={{
                      width: '25px',
                      height: '25px',
                    }}
                  />
                  Hardware
                </ListItemLink>
                <ListItemLink href="/hardware-e-peças/cpus">
                  Processadores
                </ListItemLink>
                <ListItemLink href="/hardware-e-peças/coolers">
                  Coolers Para Processadores
                </ListItemLink>
                <ListItemLink href="/hardware-e-peças/hdd-ssd">
                  Unidade De Armazenamento
                </ListItemLink>
                <ListItemLink href="/hardware-e-peças/ram">
                  Memórias RAM
                </ListItemLink>
                <ListItemLink href="/hardware-e-peças/motherboard">
                  Placas-Mãe
                </ListItemLink>
                <ListItemLink href="/hardware-e-peças/psu">
                  Fontes De Alimentação
                </ListItemLink>
                <ListItemLink href="/hardware-e-peças/gpus">
                  Placas De Vídeo
                </ListItemLink>
                <ListItemLink href="/hardware-e-peças/gabinetes">
                  Gabinetes/Cases
                </ListItemLink>
                <ListItemLink href="/hardware-e-peças/gabinetes">
                  Monitores
                </ListItemLink>
              </ul>

              <ul>
                <ListItemLink href="/perifericos">
                  <BiHeadphone
                    style={{
                      width: '25px',
                      height: '25px',
                    }}
                  />
                  Periféricos E Decorativos
                </ListItemLink>
                <ListItemLink href="utilitarios-tecnologicos/ventoinhas">
                  Ventoinhas Para Gabinete
                </ListItemLink>
                <ListItemLink href="/decorativos/leds">
                  LED E Iluminação
                </ListItemLink>
                <ListItemLink href="/perifericos/teclados">
                  Teclado
                </ListItemLink>
                <ListItemLink href="/perifericos/mouse">Mouses</ListItemLink>
                <ListItemLink href="/perifericos/caixas-de-som">
                  Caixas De Som
                </ListItemLink>
                <ListItemLink href="/perifericos/headsets">
                  Headsets
                </ListItemLink>
                <ListItemLink href="/perifericos/pendrive">
                  Pendrive
                </ListItemLink>
                <ListItemLink href="/perifericos/mousepads">
                  Mousepads
                </ListItemLink>
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

export default NavigationMenuDemo
