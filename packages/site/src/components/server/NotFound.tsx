import type { SC } from "@site/lib/types";
import { SmallHeader } from "./SmallHeader";
import { StandardContainer } from "../universal/StandardContainer";

export const NotFound: SC = () => {
  return (
    <div className="flex flex-col gap-8">
      <SmallHeader />
      <StandardContainer>
        <div className="flex flex-col gap-8 items-center py-8">
          <h1 className="text-4xl sm:text-5xl font-bold font-headline">
            Not Found
          </h1>
          <p className="text-lg sm:text-xl text-center text-gray-600">
            The page you were looking for does not exist.
          </p>
          <a
            href="/"
            className="bg-gray-800 text-white py-1.5 px-6 text-lg flex items-center gap-2 hover:bg-gray-900 transition-colors active:bg-black my-6"
          >
            Return to the homepage
          </a>
        </div>
      </StandardContainer>
    </div>
  );
};
