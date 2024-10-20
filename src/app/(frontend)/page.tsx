import Layout from "@/collections/Layouts/Component";
import { queryLayout } from "@/collections/Layouts/query";
import { getCachedGlobal } from "@/utilities/getGlobals";

export default async function HomePage() {
  const settings = await getCachedGlobal('settings', 3)();
  const queryResult = await queryLayout({ layoutOrId: settings?.homeLayout });

  if (!queryResult) return <div>Home layout not found</div>;

  return <Layout {...queryResult} />
}
