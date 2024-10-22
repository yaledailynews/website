import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import logo from '@/assets/logo.webp'

import type { Header } from '@payload-types'
import Image from 'next/image'
import Link from 'next/link'
import {
  IconBrandInstagram,
  IconBrandSpotifyFilled,
  IconBrandX,
  IconBrandYoutubeFilled,
  IconMenu2,
  IconSearch,
  IconX,
} from '@tabler/icons-react'
import { CMSLink } from '@/components/Link'

function celciusToFarenheit(celcius: number) {
  return (celcius * 9) / 5 + 32
}

export async function Header() {
  const header = await getCachedGlobal('header', 1)();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const volume = 'CXLV'

  const weatherRes = await fetch(
    `https://api.weather.gov/stations/KHVN/observations/latest?require_qc=false`,
    {
      headers: {
        'User-Agent': 'Yale Daily News',
        accept: 'application/geo+json',
      },
    },
  )
  const weatherData = await weatherRes.json()
  const weather = {
    temp: celciusToFarenheit(weatherData.properties.temperature.value),
    icon: weatherData.properties.icon as string,
    description: weatherData.properties.textDescription as string,
  }

  return (
    <header className="border-b md:border-b border-b-gray-300">
      <input type="checkbox" id="drawer-toggle" className="hidden" />
      <div className="md:pb-3 md:pt-3.5 py-2 px-5 md:px-0 grid grid-cols-1 md:grid-cols-[12rem_1fr_12rem] md:justify-items-center">
        <div className="hidden md:flex h-full flex-col justify-between w-full py-1 px-4 md:px-0">
          <Link href="/search" aria-label="Search">
            <IconSearch className="w-4 h-4 text-black" />
          </Link>
          <div className="flex flex-col gap-2 text-xs">
            <p className="font-bold whitespace-nowrap">{currentDate}</p>
            <p>Vol. {volume}</p>
          </div>
        </div>
        <div className="w-full flex justify-between items-center md:block">
          <label htmlFor="drawer-toggle" className="drawer-toggle-label cursor-pointer">
            <IconMenu2 className="size-5" />
          </label>
          <Link href="/" className="flex flex-col items-center">
            <Image
              src={logo}
              alt="YDN Logo"
              className="w-full max-w-36 md:max-w-xs h-auto" // dark:invert-[0.9] once we do dark-mode
              loading="eager"
            />
          </Link>
          <Link href="/search" className="md:hidden">
            <IconSearch className="size-5" />
          </Link>
        </div>
        <div className="hidden md:flex h-full flex-col justify-between w-full items-end py-1 px-4 md:px-0">
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/yaledailynews" aria-label="Instagram">
              <IconBrandInstagram className="w-4 h-4 text-black cursor" />
            </a>
            <a href="https://x.com/yaledailynews" aria-label="X">
              <IconBrandX className="w-4 h-4 text-black cursor" />
            </a>
            <a
              href="https://open.spotify.com/show/3vcPhX7wJ8ftiULsIRp2vG?si=38baef64f1124659&utm_campaign=button_list_PodcastsSpotify&utm_medium=referral&utm_source=later-linkinbio&nd=1&dlsi=8404ff628b9c41de"
              aria-label="Spotify"
            >
              <IconBrandSpotifyFilled className="w-4 h-4 text-black cursor" />
            </a>
            <a href="https://www.youtube.com/channel/UCxANE19ioVdQV05_oCalAtg" aria-label="YouTube">
              <IconBrandYoutubeFilled className="w-4 h-4 text-black cursor" />
            </a>
          </div>
          <div className="flex flex-col gap-2 text-xs items-end">
            <p className="font-bold">New Haven, Connecticut</p>
            <p>
              {weather.description}, {Math.round(weather.temp)}°F
            </p>
          </div>
        </div>
      </div>
      <nav className="drawer max-h-screen overflow-y-scroll md:overflow-hidden flex flex-col md:flex-row md:justify-between md:gap-10 border-r border-gray-500 md:border-gray-300 md:border-r-0 shadow md:shadow-none bg-white md:border-t pb-20 md:pb-0 px-2 pt-2 md:pt-0">
        <label htmlFor="drawer-toggle" className="drawer-toggle-label cursor-pointer md:hidden p-4">
          <IconX className="size-5" />
        </label>
        {header.navItems && (
          <ul className="flex flex-col justify-center md:w-full md:flex-row md:flex py-2 md:py-0">
            {header.navItems.map(({ link, id }) => (
              <li key={id}>
                <CMSLink
                  appearance="inline"
                  className="flex text-sm md:text-xs text-black hover:underline decoration-2 underline-offset-4 px-4 py-2 md:py-3.5 md:px-4"
                  {...link}
                />
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  )
}
