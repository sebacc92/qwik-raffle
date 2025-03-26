import { formAction$, valiForm$, type FormActionResult } from "@modular-forms/qwik";
import { type RaffleForm, type RaffleResponseData, RaffleSchema } from "~/schemas/raffleSchema";
import Drizzler from "../../../drizzle";
import { schema } from "../../../drizzle/schema";

export const useFormRaffleAction = formAction$<RaffleForm, RaffleResponseData>(
    async (values) => {
        console.log('useFormRaffleAction')
        console.log('values', values)
        const db = Drizzler();
        try {
            await db.insert(schema.raffles).values(values);
            return {
                status: 'success',
                message: "Rifa creada exitosamente",
                data: {
                    success: true,
                    message: "Rifa creada exitosamente",
                    data: {
                        raffle_id: "temp-id", // TODO: Obtener el ID real de la rifa creada
                        share_link: "temp-link" // TODO: Generar link real
                    }
                }
            } as FormActionResult<RaffleForm, RaffleResponseData>;
        } catch (error: any) {
            console.error("Error creating raffle: ", error);
            return {
                status: 'error',
                message: error.message
            } as FormActionResult<RaffleForm, RaffleResponseData>;
        }
    },
    valiForm$(RaffleSchema)
)