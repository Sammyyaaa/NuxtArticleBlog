import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
neonConfig.webSocketConstructor = ws

const config = useRuntimeConfig()
export const pool = new Pool({ connectionString: config.databaseUrl })

export default {
  pool
}
