import Link from 'next/link'
import React from 'react'
import type { Footer } from '@payload-types'
import logo from '@/assets/logo.webp'
import Image from 'next/image'
import { getGlobal } from '@/utilities/cache'
import { StandardContainer } from '@/components/StandardContainer'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

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
            <RichText content={footer.description} font="serif" size="xs" />
            <div className="flex flex-col gap-2 font-medium text-xs">
              <p>{footer.companyName}</p>
              <p>{footer.address}</p>
              <p>
                <a
                  href={`tel:${footer.phone.replace(/\D/g, '')}`}
                  className="text-sky-800 underline"
                >
                  {footer.phone}
                </a>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-[3fr_2fr]">
              <ul className="grid gap-3 grid-cols-2 font-medium text-sm">
                {footer.navItems?.map(({ link, id }) => (
                  <li key={id}>
                    <CMSLink
                      appearance="inline"
                      className="hover:underline underline-offset-2"
                      {...link}
                    />
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col sm:flex-row md:flex-col gap-5 font-medium text-sm justify-start items-start">
                <li>
                  <CMSLink
                    appearance="inline"
                    className="bg-gray-800 border border-gray-800 text-white px-3 py-1 w-full sm:w-auto text-center"
                    {...footer.primaryButton}
                  />
                </li>
                <li>
                  <CMSLink
                    appearance="inline"
                    className="border-gray-300 border text-gray-700 px-3 py-1 w-full sm:w-auto text-center"
                    {...footer.secondaryButton}
                  />
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              {footer.contacts?.map(({ name, email, phone }) => (
                <p key={name} className="text-xs flex flex-wrap gap-2 items-center">
                  <span className="font-medium">{name}:</span>
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-sky-800 underline">
                    {phone}
                  </a>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <a href={`mailto:${email}`} className="text-sky-800 underline">
                    {email}
                  </a>
                </p>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </StandardContainer>
  )
}
