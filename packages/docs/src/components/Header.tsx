import { cssObj } from '@fuel-ui/css';
import { Box, Button, Flex, FuelLogo, Icon } from '@fuel-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MobileMenu } from './MobileMenu';
import { Search } from './Search';

export function Header() {
  const pathname = usePathname();
  const isDocsActive = pathname?.startsWith('/docs');

  return (
    <Flex as="header" css={styles.root}>
      <Flex css={{ alignItems: 'center', flex: 1 }}>
        <Link href="/" className="logo">
          <FuelLogo size={40} />
          <Flex css={styles.logoText}>
            <span>Fuel Wallet</span>
            <Box as="span" css={styles.version}>
              alpha
            </Box>
          </Flex>
        </Link>
      </Flex>
      <Box css={styles.desktop}>
        <Flex css={styles.menu}>
          <Link href="/docs/install" className={isDocsActive ? 'active' : ''}>
            Docs
          </Link>
          {process.env.NEXT_PUBLIC_PREVIEW && (
            <a
              href={process.env.NEXT_PUBLIC_STORYBOOK_URL}
              target="_blank"
              rel="noreferrer"
            >
              Storybook
            </a>
          )}
          <a
            href="https://github.com/fuellabs/fuels-wallet"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon={Icon.is('GithubLogo')} size={24} />
          </a>
        </Flex>
        <Search />
        <Box css={{ ml: '$8' }}>
          {process.env.NEXT_PUBLIC_PREVIEW ? (
            <Button as="a" href={process.env.NEXT_PUBLIC_APP_URL}>
              Open Wallet
            </Button>
          ) : (
            <a href={process.env.NEXT_PUBLIC_WALLET_DOWNLOAD_URL} download>
              <Button>Download Fuel Wallet</Button>
            </a>
          )}
        </Box>
      </Box>
      <MobileMenu />
    </Flex>
  );
}

const styles = {
  root: cssObj({
    zIndex: '$10',
    position: 'sticky',
    top: 0,
    background: '#090a0a',
    gap: '$2',
    py: '$4',
    px: '$4',
    alignItems: 'center',
    borderBottom: '1px solid $gray2',
    gridColumn: '1 / 4',

    '.logo': {
      display: 'inline-flex',
      color: '$gray9',
    },

    '@md': {
      px: '$8',
    },

    '@xl': {
      position: 'relative',
      py: '$4',
      px: '$8',
    },
  }),
  logoText: cssObj({
    pl: '$6',
    alignItems: 'center',
    flex: 1,
    fontSize: '$2xl',
    fontWeight: '$semibold',
    color: 'white',
    letterSpacing: '-0.05em',
  }),
  version: cssObj({
    ml: '$2',
    color: '$gray8',
    fontSize: '$xs',
    fontStyle: 'italic',
  }),
  desktop: cssObj({
    display: 'none',

    '@xl': {
      display: 'flex',
      alignItems: 'center',
    },
  }),
  mobile: cssObj({
    display: 'flex',
    alignItems: 'center',
    '.fuel_button': {
      height: 'auto !important',
      padding: '$0 !important',
    },

    '@xl': {
      display: 'none',
    },
  }),
  menu: cssObj({
    gap: '$6',

    a: {
      color: '$gray10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$accent11',
    },
  }),
};
