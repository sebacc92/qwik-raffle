import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import type { RaffleForm } from "~/schemas/raffleSchema";

export const useFormRaffleLoader = routeLoader$<InitialValues<RaffleForm>>(() => {
    return {
        name: '',
        numberCount: 2,
        pricePerNumber: 1.00
    }
})