import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/pages/home',
    home: true,
  },
  {
    title: 'PUBLIC KEY',
    group: true,
    icon: 'star'
  },
  {
    title: 'RSA',
    link: '/pages/publica/rsa',
    icon: 'unlock',
  },
  {
    title: 'Rabin',
    link: '/pages/publica/rabin',
    icon: 'unlock'
  },
  {
    title: 'ElGamal (M-V)',
    link: '/pages/publica/elgamal',
    icon: 'unlock'
  },
  {
    title: 'Digital Sign (DSS)',
    link: '/pages/publica/firma',
    icon: 'book-open'
  },
  {
    title: 'Tables & Data',
    icon: 'grid-outline',
    children: [
      {
        title: 'Smart Table',
        link: '/pages/tables/smart-table',
      },
      {
        title: 'Tree Grid',
        link: '/pages/tables/tree-grid',
      },
    ],
  },
  {
    title: 'Miscellaneous',
    icon: 'shuffle-2-outline',
    children: [
      {
        title: '404',
        link: '/pages/miscellaneous/404',
      },
    ],
  },
];
