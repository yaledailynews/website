const SITE_URL = process.env.SITE_URL
if (!SITE_URL) {
  throw new Error('Missing SITE_URL')
}

export async function purgeKeys(keys: string[]) {
  try {
    const res = await fetch(`${SITE_URL}/purge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keys }),
    })
    const data = await res.json()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}
