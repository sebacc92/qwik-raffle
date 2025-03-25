import * as v from 'valibot'

export const RaffleSchema = v.object({
    name: v.pipe(
        v.string("Name must be a string"),
        v.minLength(3, "Name must be at least 3 characters"),
        v.maxLength(100, "Name must be at most 100 characters")
    )
})

export type RaffleForm = v.InferInput<typeof RaffleSchema>

export interface RaffleResponseData {
    success: boolean;
    message: string;
    data?: {
        raffle_id: string;
        share_link: string;
    };
}