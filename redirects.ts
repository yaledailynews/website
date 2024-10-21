import type { NextConfig } from 'next'
type Redirects = NextConfig['redirects']
type Redirect = Awaited<ReturnType<NonNullable<Redirects>>>[number]

const redirects = async () => {
  const internetExplorerRedirect: Redirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const redirects = [internetExplorerRedirect]

  return redirects
}

export default redirects
