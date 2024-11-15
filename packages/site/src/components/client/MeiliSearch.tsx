import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { makeIsland } from "@site/lib/makeIsland";
import { clientEnv } from "@builder/clientEnv";
import { useEffect } from "hono/jsx";
import instantsearch from "instantsearch.js";
import { hits, pagination, searchBox } from "instantsearch.js/es/widgets";
import { IconLoader2 } from "../universal/Icons";

function MeiliSearch() {
  useEffect(() => {
    let isEmpty = !window.location.search;

    const { searchClient } = instantMeiliSearch(
      clientEnv.VITE_MEILI_URL,
      clientEnv.VITE_MEILI_SEARCH_KEY,
      {
        meiliSearchParams: {
          hybrid: {
            embedder: "openai",
            semanticRatio: 0.5,
          },
        },
      },
    );

    const search = instantsearch({
      indexName: clientEnv.VITE_MEILI_SEARCH_INDEX,
      searchClient,
      routing: true,
    });

    search.on("render", () => {
      if (isEmpty) {
        document.getElementById("hits")?.classList.add("hidden");
        document.getElementById("pagination")?.classList.add("hidden");
        document.getElementById("empty")?.classList.remove("hidden");
      } else {
        document.getElementById("hits")?.classList.remove("hidden");
        document.getElementById("pagination")?.classList.remove("hidden");
        document.getElementById("empty")?.classList.add("hidden");
      }
      if (
        !isEmpty &&
        (search.status === "loading" || search.status === "stalled")
      ) {
        document.getElementById("loading")?.classList.remove("hidden");
        document.getElementById("hits")?.classList.add("hidden");
        document.getElementById("pagination")?.classList.add("hidden");
      } else {
        document.getElementById("loading")?.classList.add("hidden");
        if (!isEmpty) {
          document.getElementById("hits")?.classList.remove("hidden");
          document.getElementById("pagination")?.classList.remove("hidden");
        }
      }
    });

    search.addWidgets([
      searchBox({
        container: "#searchbox",
        autofocus: true,
        showReset: false,
        searchAsYouType: false,
        placeholder: "Search for posts",
        showLoadingIndicator: false,
        queryHook: (query, search) => {
          if (query.trim() === "") {
            isEmpty = true;
          } else {
            isEmpty = false;
            search(query);
          }
        },
        templates: {
          submit: (_, { html }) => html`
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
          `,
        },
        cssClasses: {
          input:
            "w-full bg-gray-100 rounded-none focus:border-gray-400 focus:outline-none border border-solid border-gray-300 px-3 py-1.5 sm:py-2 shadow-inner",
          form: "relative grid grid-cols-[1fr_auto] gap-2",
          submit:
            "text-sm sm:text-base bg-sky-700 rounded-none focus:ring-0 focus:outline-none px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-white hover:bg-sky-800 active:bg-sky-900 transition-colors",
        },
      }),
      hits({
        container: "#hits",
        cssClasses: {
          list: "grid",
          item: "border-b border-gray-300 py-6 last:border-b-0 first:pt-0",
        },
        templates: {
          item: (hit, { html, components }) => html`
            <a
              href="/posts/${hit["slug"]}"
              class="hover:opacity-70 transition-opacity"
            >
              <article class="grid gap-4 sm:grid-cols-[2fr,1fr]">
                <div className="space-y-2">
                  <h1>
                    ${components.Highlight({
                      attribute: "title",
                      hit,
                      className: "font-headline text-xl",
                    })}
                  </h1>
                  <p>
                    ${components.Snippet({
                      attribute: "subhead",
                      hit,
                      className: "font-serif text-gray-800",
                    })}
                  </p>
                  <p>
                    ${components.Snippet({
                      attribute: "authors",
                      hit,
                      className: "text-gray-500 text-xs",
                    })}
                  </p>
                </div>
                ${hit["coverUrl"]
                  ? html`<img
                      src="${clientEnv.VITE_S3_URL}/${hit["coverUrl"]}"
                      class="w-full"
                    />`
                  : ""}
              </article>
            </a>
          `,
        },
      }),
      pagination({
        container: "#pagination",
        cssClasses: {
          item: "flex",
          selectedItem: "text-sm sm:text-base !bg-sky-700 !text-white",
          firstPageItem:
            "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors",
          nextPageItem:
            "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors",
          previousPageItem:
            "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors",
          lastPageItem:
            "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors",
          link: "text-center text-sm sm:text-base px-4 py-1.5 sm:py-2 hover:cursor-pointer",
          pageItem:
            "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors",
          list: "flex gap-2 justify-center",
        },
      }),
    ]);

    search.start();

    console.log("MeiliSearch client:", searchClient);
  });

  return (
    <div class="flex flex-col gap-4">
      <h1 class="text-3xl font-headline">Search</h1>
      <div id="searchbox"></div>
      <div id="empty">
        <p class="text-gray-500">Enter a search to get started.</p>
      </div>
      <div id="loading">
        <IconLoader2 class="size-10 text-gray-300 animate-spin" />
      </div>
      <div id="hits"></div>
      <div id="pagination"></div>
    </div>
  );
}

export const [MeiliSearchIsland, hydrateMeiliSearch] = makeIsland(
  "meilisearch",
  <MeiliSearch />,
);
