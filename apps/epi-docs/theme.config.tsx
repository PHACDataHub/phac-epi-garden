import React from 'react'
import { type DocsThemeConfig } from 'nextra-theme-docs'
import Image from "next/image";

const logo = (
  <span style={{ display: 'flex', alignItems: 'center' }}>
    <Image
      style={{ marginRight: '0.3rem' }}
      src="/images/epi-logo.svg"
      alt="Epi-Logo"
      width={32}
      height={32}
    />
    <span>Epi Docs</span>
  </span>
)

const config: DocsThemeConfig = {
  logo,
  project: {
    link: 'https://github.com/daneroo/phac-epi-garden',
  },
  docsRepositoryBase: 'https://github.com/daneroo/phac-epi-garden/tree/main/apps/epi-docs',
  footer: {
    text: 'Epicenter Docs',
  },
  head: (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#2b5797" />
      <meta name="theme-color" content="#ffffff" />
    </>
  )
}

export default config
