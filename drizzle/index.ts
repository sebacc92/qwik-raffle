import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { schema } from "./schema"

export default () => {
    try {
        const sqlite = createClient({
            url: "file:./drizzle/db/db.sqlite"
        })
        const db = drizzle(sqlite, { schema })
        return db
    } catch (error) {
        console.error("Error creating db client: ", error)
        throw error
    }
}