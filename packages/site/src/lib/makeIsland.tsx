import type { DOMAttributes, FC, Child } from "hono/jsx";
import { render } from "hono/jsx/dom";

export function makeIsland(id: string, component: Child) {
  const className = `__island-${id}`;
  const Island: FC = (props: DOMAttributes) => (
    <div class={className} {...props}>
      {component}
    </div>
  );
  const renderIsland = () => {
    window.addEventListener("load", () => {
      const islands = document.getElementsByClassName(className);
      const numIslands = islands.length;
      for (let i = 0; i < numIslands; i++) {
        render(component, islands[i] as HTMLElement);
      }
    });
  };
  return [Island, renderIsland] as const;
}
