import * as v from 'valibot'

const MIN_VALUE = 2
const MAX_VALUE = 1000
const MIN_PRICE = 0.01
const MAX_PRICE = 10000

export const RaffleSchema = v.object({
    name: v.pipe(
        v.string("Name must be a string"),
        v.minLength(3, "Name must be at least 3 characters"),
        v.maxLength(100, "Name must be at most 100 characters")
    ),
    numberCount: v.pipe(
        v.number("Number count must be a number"),
        v.minValue(MIN_VALUE, `Number count must be at least ${MIN_VALUE}`),
        v.maxValue(MAX_VALUE, `Number count must be at most ${MAX_VALUE}`)
    ),
    pricePerNumber: v.pipe(
        v.number("Price must be a number"),
        v.minValue(MIN_PRICE, `Price must be at least ${MIN_PRICE}`),
        v.maxValue(MAX_PRICE, `Price must be at most ${MAX_PRICE}`)
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