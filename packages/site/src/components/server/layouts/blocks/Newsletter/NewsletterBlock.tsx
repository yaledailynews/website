import type {
  NewsletterBlock as NewsletterBlockProps,
  Layout,
} from "@cms/payload-types";
import type { SC } from "@site/lib/types";

type Props = {
  block: NewsletterBlockProps;
  layout: Layout;
};

export const NewsletterBlock: SC<Props> = ({}) => {
  return (
    <div class="flex flex-col gap-4">
      <p class="text-gray-500 text-sm">
        Get the latest news delivered right to your inbox.
      </p>
      <form class="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email address"
          class="border border-gray-300 px-3 py-2 text-sm"
        />
        <button class="bg-sky-700 border border-sky-700 text-white px-3 py-1 text-sm">
          Subscribe
        </button>
      </form>
    </div>
  );
};
