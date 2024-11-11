import Link from 'next/link'
import React from 'react'
import type { Footer } from '@payload-types'
import logo from '@/assets/logo.webp'
import Image from 'next/image'
import { getGlobal } from '@/utilities/cache'
import { StandardContainer } from '@/components/StandardContainer'

export async function Footer() {
  const footer: Footer = await getGlobal('footer')()

  return (
    <StandardContainer>
      <footer className="border-t-2 border-t-gray-700 py-8 sm:pb-12 md:pb-16 flex flex-col gap-6 px-6 sm:px-7 md:px-0">
        <Image
          src={logo}
          alt="YDN Logo"
          className="w-48 max-w-full" // dark:invert-[0.9] once we do dark mode
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div className="flex flex-col gap-8">
            <p className="text-gray-600 text-sm font-serif">
              The Yale Daily News is the nation&apos;s oldest college daily newspaper and has been
              financially and editorially independent since its founding on January 28, 1878. It
              publishes Monday through Friday during the academic year and serves the communities of
              Yale and New Haven.{' '}
              <span className="underline text-sky-700">
                <Link href="/about">More about us.</Link>
              </span>
            </p>
            <div className="flex flex-col gap-2 font-medium text-xs">
              <p>Yale Daily News Publishing Company, Inc.</p>
              <p>202 York Street, New Haven, CT 06511</p>
              <p>
                <a href="tel:2034322400" className="text-sky-800 underline">
                  (203) 432-2400
                </a>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-[3fr_2fr]">
              <ul className="grid gap-3 grid-cols-2 font-medium text-sm">
                <li>
                  <Link href="/corrections">Submit a letter</Link>
                </li>
                <li>
                  <Link href="/advertise">Advertise</Link>
                </li>
                <li>
                  <Link href="/tips">Send a tip</Link>
                </li>
                {/* <li>
              <Link href="/donate">Donate</Link>
            </li> */}
                <li>
                  <a href="https://issuu.com/yaledailynews">Read print version</a>
                </li>
                <li>
                  <Link href="/legal">Legal</Link>
                </li>
                <li>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSd8ZaNTMw6FSOZ3QkjygCMUWeNGmeBJMlZ24izSF5ujNPFCWQ/viewform"
                    target="_blank"
                  >
                    Report a bug
                  </a>
                </li>
              </ul>
              <ul className="flex flex-col sm:flex-row md:flex-col gap-5 font-medium text-sm justify-start items-start">
                <li>
                  <Link
                    href="/join"
                    className="bg-gray-800 border border-gray-800 text-white px-3 py-1 w-full sm:w-auto text-center"
                  >
                    Join the News
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donate"
                    className="border-gray-300 border text-gray-700 px-3 py-1 w-full sm:w-auto text-center"
                  >
                    Donate
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs flex flex-wrap gap-2 items-center">
                <span className="font-medium">Editorial:</span>
                <a href="tel:2034322418" className="text-sky-800 underline">
                  (203) 432-2418
                </a>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <a href="mailto:editor@yaledailynews.com" className="text-sky-800 underline">
                  editor@yaledailynews.com
                </a>
              </p>
              <p className="text-xs flex flex-wrap gap-2 items-center">
                <span className="font-medium">Business:</span>
                <a href="tel:2034322424" className="text-sky-800 underline">
                  (203) 432-2424
                </a>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <a href="mailto:business@yaledailynews.com" className="text-sky-800 underline">
                  business@yaledailynews.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </StandardContainer>
  )
}
