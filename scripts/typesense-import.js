import Typesense from 'typesense'
import Properties from '../src/data/properties.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: process.env.TYPESENSE_PORT ? parseInt(process.env.TYPESENSE_PORT) : 8108,
      protocol: process.env.TYPESENSE_PROTOCOL || 'http'
    }
  ],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 2
})

async function run() {
  // create collection
  try {
    await client.collections('properties').retrieve()
    console.log('Collection exists, deleting...')
    await client.collections('properties').delete()
  } catch (e) {
    // not exist
  }

  await client.collections().create({
    name: 'properties',
    fields: [
      { name: 'id', type: 'int32' },
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'city', type: 'string', facet: true },
      { name: 'price', type: 'int32', facet: true },
      { name: 'bedrooms', type: 'int32', facet: true }
    ],
    default_sorting_field: 'price'
  })

  const docs = Properties.map(p => ({ ...p, id: p.id }))
  const importResult = await client.collections('properties').documents().import(docs, { action: 'upsert' })
  console.log('Import complete')
  console.log(importResult)
}

run().catch(err => { console.error(err); process.exit(1) })
