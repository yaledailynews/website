import type { FC } from "hono/jsx";
import { StandardContainer } from "@site/components/universal/StandardContainer";
import { getGlobal } from "@site/lib/cache";
import { CMSLink } from "./CMSLink";

export const Footer: FC = async () => {
  const footer = await getGlobal("footer");

  return (
    <StandardContainer>
      <footer class="border-t-2 border-t-gray-700 py-8 sm:pb-12 md:pb-16 flex flex-col gap-6 px-6 sm:px-7 md:px-0">
        <img
          src="/logo.webp"
          width={981}
          height={265}
          alt="YDN Logo"
          class="w-48 max-w-full"
          loading="lazy"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div class="flex flex-col gap-8">
            {/* <RichText content={footer.description} font="serif" size="xs" /> */}
            <div class="flex flex-col gap-2 font-medium text-xs">
              <p>{footer.companyName}</p>
              <p>{footer.address}</p>
              <p>
                <a
                  href={`tel:${footer.phone?.replace(/\D/g, "")}`}
                  class="text-sky-800 underline"
                >
                  {footer.phone}
                </a>
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-8">
            <div class="grid gap-6 grid-cols-1 sm:grid-cols-[3fr_2fr]">
              <ul class="grid gap-3 grid-cols-2 font-medium text-sm">
                {footer.navItems?.map(({ link }) => (
                  <li>
                    <CMSLink
                      class="hover:underline underline-offset-2"
                      {...link}
                    />
                  </li>
                ))}
              </ul>
              <ul class="flex flex-col sm:flex-row md:flex-col gap-5 font-medium text-sm justify-start items-start">
                <li>
                  <CMSLink
                    class="bg-gray-800 border border-gray-800 text-white px-3 py-1 w-full sm:w-auto text-center"
                    {...footer.primaryButton}
                  />
                </li>
                <li>
                  <CMSLink
                    class="border-gray-300 border text-gray-700 px-3 py-1 w-full sm:w-auto text-center"
                    {...footer.secondaryButton}
                  />
                </li>
              </ul>
            </div>
            <div class="flex flex-col gap-2">
              {footer.contacts?.map(({ name, email, phone }) => (
                <p class="text-xs flex flex-wrap gap-2 items-center">
                  <span class="font-medium">{name}:</span>
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    class="text-sky-800 underline"
                  >
                    {phone}
                  </a>
                  <span class="text-gray-300 hidden sm:inline">|</span>
                  <a href={`mailto:${email}`} class="text-sky-800 underline">
                    {email}
                  </a>
                </p>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </StandardContainer>
  );
};
