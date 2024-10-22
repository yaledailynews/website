import Layout from "@/collections/Layouts/Component";
import { queryLayout } from "@/collections/Layouts/query";
import { getGlobal } from "@/utilities/cache";

export default async function HomePage() {
  const settings = await getGlobal('settings')();
  console.log('settings', settings);
  const queryResult = await queryLayout(settings?.homeLayout);

  if (!queryResult) return <div>Home layout not found</div>;

  return <Layout {...queryResult} />
}
