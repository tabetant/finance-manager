import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { helpRequests } from './drizzle/schema'

const connectionString = process.env.DATABASE_URL

// Disable prefetch as it is not supported for "Transaction" pool mode
const supabase = postgres(connectionString!, { prepare: false })
export const db = drizzle(supabase);

const allTickers = await db.select().from(helpRequests);
