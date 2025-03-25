import { formAction$, valiForm$ } from "@modular-forms/qwik";
import { type RaffleForm, type RaffleResponseData, RaffleSchema } from "~/schemas/raffleSchema";

export const useFormRaffleAction = formAction$<RaffleForm, RaffleResponseData>(
    async (values) => {
        console.log('useFormRaffleAction')
        console.log('values', values)
        const response = await fetch('/api/raffle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
        return await response.json()
    },
    valiForm$(RaffleSchema)
)