import { IconCheck, IconLink } from "@site/components/universal/Icons";
import { cn } from "@site/lib/utils";
import { useState } from "hono/jsx";
import { makeIsland } from "@site/lib/makeIsland";

export function CopyLink() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <button
      className={cn(
        "py-2 px-3 rounded-full transition-colors flex items-center gap-2",
        {
          "bg-gray-100 hover:bg-gray-200 active:bg-gray-300": !copied,
          "bg-blue-200 text-blue-800": copied,
        },
      )}
      aria-label="Copy link"
      onClick={copy}
    >
      <span className="text-sm">{copied ? "Copied" : "Copy"}</span>
      {copied ? <IconCheck class="size-5" /> : <IconLink class="size-5" />}
    </button>
  );
}

export const [CopyLinkIsland, hydrateCopyLink] = makeIsland(
  "copy-link",
  <CopyLink />,
);
