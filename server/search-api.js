import express from 'express'
import cors from 'cors'
import Typesense from 'typesense'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

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

app.get('/search', async (req, res) => {
  const q = req.query.q || '*'
  const city = req.query.city
  const priceMax = req.query.priceMax
  const perPage = parseInt(req.query.perPage) || 12
  const page = parseInt(req.query.page) || 1

  const filter_by = []
  if (city) filter_by.push(`city:=${city}`)
  if (priceMax) filter_by.push(`price:<=${priceMax}`)

  const searchParams = {
    q,
    query_by: 'title,description,city',
    per_page: perPage,
    page,
    filter_by: filter_by.join(' && ')
  }

  try {
    const results = await client.collections('properties').documents().search(searchParams)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 4200
app.listen(PORT, () => console.log(`Search API running on http://localhost:${PORT}`))
