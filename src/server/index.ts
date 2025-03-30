import { Session } from "~/types/session";
import Drizzler from "../../drizzle";
import { schema } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const getUser = async (ctx: Session | null) => {
    if (ctx) {
        const db = Drizzler();
        return await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, ctx.user.email))
            .execute();
    }
};

export const createUser = async (session: Session) => {
    const db = Drizzler();
    if (!session) return;

    try {
        const base = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, session.user.email));

        if (base.length == 0) {
            return await db
                .insert(schema.users)
                .values({
                    email: session.user.email,
                    name: session.user.name,
                })
                .execute();
        }
        return base;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};