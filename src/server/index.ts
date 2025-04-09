import { Session } from "~/types/session";
import Drizzler from "../../drizzle";
import { schema } from "../../drizzle/schema";
import { eq, and, gte, or, isNull } from "drizzle-orm";

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

export const getUserActiveRaffles = async (userId: number) => {
    if (!userId) return [];
    
    const db = Drizzler();
    
    try {
        // Get active raffles for this user
        // An active raffle is one that either:
        // 1. Hasn't expired yet (expiresAt > now)
        // 2. Has no expiration date (expiresAt is null)
        const now = new Date();
        
        return await db
            .select()
            .from(schema.raffles)
            .where(
                and(
                    eq(schema.raffles.creatorId, userId),
                    or(
                        gte(schema.raffles.expiresAt, now),
                        isNull(schema.raffles.expiresAt)
                    )
                )
            )
            .execute();
    } catch (error) {
        console.error("Error getting user active raffles:", error);
        return [];
    }
};