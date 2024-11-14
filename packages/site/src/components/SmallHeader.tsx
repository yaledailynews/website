import { getGlobal } from "@site/lib/cache";
import { IconMenu2, IconSearch, IconX } from "@site/universal/Icons";
import { CMSLink } from "./CMSLink";

export async function SmallHeader() {
  const header = await getGlobal("header");

  return (
    <header class="px-3 py-2 bg-black text-white flex justify-between items-center sticky top-0 z-50 shadow">
      <input type="checkbox" id="drawer-toggle" class="hidden" />
      <div class="flex justify-start items-center">
        <label
          for="drawer-toggle"
          class="drawer-toggle-label cursor-pointer p-2 hover:bg-gray-800 active:bg-gray-700 transition-colors rounded"
        >
          <IconMenu2 class="size-5" />
        </label>
      </div>
      <a href="/" class="flex justify-center items-center">
        <img
          src="/logo.webp"
          width={981}
          height={265}
          alt="YDN Logo"
          class="w-full max-w-36 h-auto invert"
          loading="eager"
        />
      </a>
      <div class="flex justify-end items-center">
        <a
          href="/search"
          class="p-2 hover:bg-gray-800 active:bg-gray-700 transition-colors rounded"
        >
          <IconSearch class="w-5 h-5" />
        </a>
      </div>
      <nav class="drawer max-h-screen overflow-y-scroll flex flex-col border-r border-gray-300 shadow bg-white pb-20 px-2 pt-2">
        <label
          for="drawer-toggle"
          class="drawer-toggle-label cursor-pointer p-4"
        >
          <IconX class="size-5 text-black" />
        </label>
        <ul class="flex flex-col justify-center py-2 md:gap-0.5 lg:gap-1">
          <li>
            <a
              class="flex text-sm md:text-base text-black hover:underline decoration-2 underline-offset-4 px-4 py-2"
              href="/"
            >
              Home
            </a>
          </li>
          {header.navItems?.map(({ link }) => (
            <li>
              <CMSLink
                class="flex text-sm md:text-base text-black hover:underline decoration-2 underline-offset-4 px-4 py-2"
                {...link}
              />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
