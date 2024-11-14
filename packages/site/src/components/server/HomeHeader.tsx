import { getGlobal } from "@site/lib/cache";
import type { FC } from "hono/jsx";
import {
  IconBrandInstagram,
  IconBrandSpotifyFilled,
  IconBrandX,
  IconBrandYoutubeFilled,
  IconMenu2,
  IconSearch,
  IconX,
} from "@site/components/universal/Icons";
import { CMSLink } from "./CMSLink";

function celciusToFarenheit(celcius: number) {
  return (celcius * 9) / 5 + 32;
}

type WeatherData = {
  temp: number;
  icon: string;
  description: string;
};

type WeatherCacheType = {
  data: null | WeatherData;
  lastUpdated: number;
};

const weatherCache: WeatherCacheType = {
  data: null,
  lastUpdated: 0,
};

async function getWeather() {
  if (weatherCache.data && Date.now() - weatherCache.lastUpdated < 3_600_000) {
    console.log("Using cached weather data");
    return weatherCache.data;
  }
  const res = await fetch(
    `https://api.weather.gov/stations/KHVN/observations/latest?require_qc=false`,
    {
      headers: {
        "User-Agent": "Yale Daily News",
        accept: "application/geo+json",
      },
    },
  );
  const weatherData = await res.json();
  // TODO: validation
  const weather = {
    temp: celciusToFarenheit(weatherData.properties.temperature.value),
    icon: weatherData.properties.icon as string,
    description: weatherData.properties.textDescription as string,
  };
  weatherCache.data = weather;
  weatherCache.lastUpdated = Date.now();

  return weather;
}

export const HomeHeader: FC = async () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const volume = "CXLV";

  const [header, weather] = await Promise.all([
    getGlobal("header"),
    getWeather(),
  ]);

  return (
    <header class="border-b md:border-b border-b-gray-300 sticky top-0 md:static">
      <input type="checkbox" id="drawer-toggle" class="hidden" />
      <div class="md:pb-3 md:pt-3.5 py-2 px-3 md:px-0 grid grid-cols-1 md:grid-cols-[12rem_1fr_12rem] md:justify-items-center">
        <div class="hidden md:flex h-full flex-col justify-between w-full py-1 px-4 md:px-0">
          <a href="/search" aria-label="Search">
            <IconSearch class="w-4 h-4 text-black hover:text-gray-600" />
          </a>
          <div class="flex flex-col gap-2 text-xs">
            <p class="font-bold whitespace-nowrap">{currentDate}</p>
            <p>Vol. {volume}</p>
          </div>
        </div>
        <div class="w-full flex justify-between items-center md:block">
          <label
            htmlFor="drawer-toggle"
            class="md:no-drawer-toggle-label drawer-toggle-label cursor-pointer p-2"
          >
            <IconMenu2 class="size-5" />
          </label>
          <a href="/" class="flex flex-col items-center">
            <img
              src="/logo.webp"
              width={981}
              height={265}
              alt="YDN Logo"
              class="w-full max-w-36 md:max-w-xs h-auto"
              loading="eager"
            />
          </a>
          <a href="/search" class="md:hidden p-2">
            <IconSearch class="size-5" />
          </a>
        </div>
        <div class="hidden md:flex h-full flex-col justify-between w-full items-end py-1 px-4 md:px-0">
          <div class="flex items-center gap-3">
            <a
              href="https://www.instagram.com/yaledailynews"
              aria-label="Instagram"
              target="_blank"
            >
              <IconBrandInstagram class="w-4 h-4 text-black cursor" />
            </a>
            <a
              href="https://x.com/yaledailynews"
              aria-label="X"
              target="_blank"
            >
              <IconBrandX class="w-4 h-4 text-black cursor" />
            </a>
            <a
              href="https://open.spotify.com/show/3vcPhX7wJ8ftiULsIRp2vG?si=38baef64f1124659&utm_campaign=button_list_PodcastsSpotify&utm_medium=referral&utm_source=later-linkinbio&nd=1&dlsi=8404ff628b9c41de"
              aria-label="Spotify"
              target="_blank"
            >
              <IconBrandSpotifyFilled class="w-4 h-4 text-black cursor" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCxANE19ioVdQV05_oCalAtg"
              aria-label="YouTube"
              target="_blank"
            >
              <IconBrandYoutubeFilled class="w-4 h-4 text-black cursor" />
            </a>
          </div>
          <div class="flex flex-col gap-2 text-xs items-end">
            <p class="font-bold">New Haven, Connecticut</p>
            <p>
              {weather.description}, {Math.round(weather.temp)}°F
            </p>
          </div>
        </div>
      </div>
      <nav class="drawer md:no-drawer max-h-screen overflow-y-scroll md:overflow-hidden flex flex-col md:flex-row md:justify-between md:gap-10 border-r border-gray-500 md:border-gray-300 md:border-r-0 shadow md:shadow-none bg-white md:border-t pb-20 md:pb-0 px-2 pt-2 md:pt-0">
        <label
          htmlFor="drawer-toggle"
          class="md:no-drawer-toggle-label drawer-toggle-label cursor-pointer md:hidden p-4"
        >
          <IconX class="size-5" />
        </label>
        {header.navItems && (
          <ul class="flex flex-col justify-center md:w-full md:flex-row md:flex py-2 md:py-0">
            {header.navItems.map(({ link }) => (
              <li>
                <CMSLink
                  class="flex text-sm md:text-xs text-black hover:underline decoration-2 underline-offset-4 px-4 py-2 md:py-3.5 md:px-4"
                  {...link}
                />
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
};
