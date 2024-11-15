// TODO

// export default async function PreviewPage({ params: paramsPromise }: Args) {
//   const { collection, id } = await paramsPromise
//   const idNumber = parseInt(id, 10)

//   const payload = await getPayloadHMR({ config: configPromise })
//   const { isEnabled: draft } = await draftMode()

//   if (collection === 'pages') {
//     const page = await payload.findByID({
//       collection,
//       draft,
//       overrideAccess: draft,
//       depth: 2,
//       id: idNumber,
//     })
//     if (!page) {
//       return notFound()
//     }
//     return <PageComponent page={page} />
//   } else if (collection === 'posts') {
//     const post = await payload.findByID({
//       collection,
//       draft,
//       overrideAccess: draft,
//       depth: 2,
//       id: idNumber,
//     })
//     if (!post) {
//       return notFound()
//     }
//     return <PostComponent post={post} draft />
//   } else if (collection === 'layouts') {
//     const layout = await payload.findByID({
//       collection,
//       draft,
//       overrideAccess: draft,
//       depth: 2,
//       id: idNumber,
//     })
//     if (!layout) {
//       return notFound()
//     }
//     const layoutQueryResult = await queryLayout(layout)
//     if (!layoutQueryResult) return notFound()
//     return <LayoutComponent {...layoutQueryResult} />
//   }
// }
