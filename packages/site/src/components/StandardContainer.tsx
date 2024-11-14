import type { PropsWithChildren } from "hono/jsx";

export const StandardContainer = (props: PropsWithChildren) => {
  return (
    <div class="md:px-6 lg:px-10 xl:px-16 max-w-7xl mx-auto w-full flex flex-col gap-5 overflow-hidden">
      {props.children}
    </div>
  );
};
