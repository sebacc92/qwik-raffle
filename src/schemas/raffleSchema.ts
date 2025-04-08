import * as v from 'valibot'

const MIN_VALUE = 2
const MAX_VALUE = 1000
const MIN_PRICE = 0.01
const MAX_PRICE = 10000

export const PrizeSchema = v.object({
    name: v.pipe(
        v.string("Prize name must be a string"),
        v.minLength(1, "Prize name cannot be empty"),
        v.maxLength(100, "Prize name must be at most 100 characters")
    ),
    description: v.optional(v.string("Prize description must be a string")),
    position: v.number("Prize position must be a number")
})

export const RaffleSchema = v.object({
    name: v.pipe(
        v.string("Name must be a string"),
        v.minLength(3, "Name must be at least 3 characters"),
        v.maxLength(100, "Name must be at most 100 characters")
    ),
    description: v.optional(v.pipe(
        v.string("Description must be a string"),
        v.maxLength(500, "Description must be at most 500 characters")
    )),
    expiresAt: v.string(),
    numberCount: v.pipe(
        v.number("Number count must be a number"),
        v.minValue(MIN_VALUE, `Number count must be at least ${MIN_VALUE}`),
        v.maxValue(MAX_VALUE, `Number count must be at most ${MAX_VALUE}`)
    ),
    pricePerNumber: v.pipe(
        v.number("Price must be a number"),
        v.minValue(MIN_PRICE, `Price must be at least ${MIN_PRICE}`),
        v.maxValue(MAX_PRICE, `Price must be at most ${MAX_PRICE}`)
    ),
    prizes: v.array(PrizeSchema, "At least one prize is required"),
    isPublic: v.boolean(),
})

export type RaffleForm = v.InferInput<typeof RaffleSchema>

export interface RaffleResponseData {
    success: boolean;
    message: string;
    data?: {
        raffle_id: number;
        share_link: string;
    };
}