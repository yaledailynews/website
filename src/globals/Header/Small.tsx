import { getGlobal } from '@/utilities/cache'
import Image from 'next/image'
import logo from '@/assets/logo.webp'
import { IconMenu2, IconSearch, IconX } from '@tabler/icons-react'
import Link from 'next/link'
import { CMSLink } from '@/components/Link'

export async function SmallHeader() {
  const header = await getGlobal('header')()

  return (
    <header className="px-3 py-2 bg-black text-white flex justify-between items-center sticky top-0 z-50 shadow">
      <input type="checkbox" id="drawer-toggle" className="hidden" />
      <div className="flex justify-start items-center">
        <label
          htmlFor="drawer-toggle"
          className="drawer-toggle-label cursor-pointer p-2 hover:bg-gray-800 active:bg-gray-700 transition-colors rounded"
        >
          <IconMenu2 className="size-5" />
        </label>
      </div>
      <Link href="/" className="flex justify-center items-center">
        <Image src={logo} alt="Yale Daily News" className="w-full max-w-36 h-auto invert" />
      </Link>
      <div className="flex justify-end items-center">
        <Link
          href="/search"
          className="p-2 hover:bg-gray-800 active:bg-gray-700 transition-colors rounded"
        >
          <IconSearch className="w-5 h-5" />
        </Link>
      </div>
      <nav className="drawer max-h-screen overflow-y-scroll flex flex-col border-r border-gray-300 shadow bg-white pb-20 px-2 pt-2">
        <label htmlFor="drawer-toggle" className="drawer-toggle-label cursor-pointer p-4">
          <IconX className="size-5 text-black" />
        </label>
        <ul className="flex flex-col justify-center py-2 md:gap-0.5 lg:gap-1">
          <li>
            <Link
              className="flex text-sm md:text-base text-black hover:underline decoration-2 underline-offset-4 px-4 py-2"
              href="/"
            >
              Home
            </Link>
          </li>
          {header.navItems?.map(({ link, id }) => (
            <li key={id}>
              <CMSLink
                appearance="inline"
                className="flex text-sm md:text-base text-black hover:underline decoration-2 underline-offset-4 px-4 py-2"
                {...link}
              />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
