import { env } from '@cms/env'

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${env.MEILI_ADMIN_KEY}`,
}

const experimentalFeaturesRes = await fetch(`${env.MEILI_URL}/experimental-features/`, {
  method: 'PATCH',
  headers,
  body: JSON.stringify({
    vectorStore: true,
  }),
})

console.log(await experimentalFeaturesRes.json())

const addOpenAIEmbedderRes = await fetch(
  `${env.MEILI_URL}/indexes/${env.NEXT_PUBLIC_MEILI_SEARCH_INDEX}/settings`,
  {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      embedders: {
        openai: {
          source: 'openAi',
          apiKey: env.OPENAI_API_KEY,
          model: 'text-embedding-3-small',
          documentTemplate:
            "An article titled '{{doc.title}}' with subtitle '{{doc.subhead}}'",
        },
      },
    }),
  },
)

console.log(await addOpenAIEmbedderRes.json())
