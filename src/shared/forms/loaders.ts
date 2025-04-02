import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import type { RaffleForm } from "~/schemas/raffleSchema";

export const useFormRaffleLoader = routeLoader$<InitialValues<RaffleForm>>(() => {
    return {
        name: '',
        description: '',
        numberCount: 2,
        pricePerNumber: 1.00,
        prizes: [
            {
                name: '',
                position: 1,
                description: ''
            }
        ],
        isPublic: false,
    }
})