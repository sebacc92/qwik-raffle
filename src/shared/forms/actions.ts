import { formAction$, valiForm$, type FormActionResult } from "@modular-forms/qwik";
import { type RaffleForm, type RaffleResponseData, RaffleSchema } from "~/schemas/raffleSchema";
import Drizzler from "../../../drizzle";
import { schema } from "../../../drizzle/schema";
import { v4 } from "uuid";
import { and, eq } from "drizzle-orm";
import { TicketForm, TicketResponseData, TicketSchema } from "~/schemas/ticketSchema";

export const useFormRaffleAction = formAction$<RaffleForm, RaffleResponseData>(
    async (values) => {
        console.log('useFormRaffleAction')
        console.log('values', values)
        const payload = {
            ...values,
            uuid: v4()
        }
        const db = Drizzler();
        try {
            // Create the raffle
            const raffles = await db.insert(schema.raffles).values(payload).returning({ 
                raffleId: schema.raffles.id,
                uuid: schema.raffles.uuid,
                numberCount: schema.raffles.numberCount
            });            
            const { raffleId, uuid, numberCount } = raffles[0];
            
            // Initialize all raffle numbers
            const raffleNumbersData = Array.from({ length: numberCount }, (_, i) => ({
                raffleId,
                number: i + 1,
                status: "unsold",
                paymentStatus: false
            }));
            
            await db.insert(schema.raffleNumbers).values(raffleNumbersData);
            
            const fullShareLink = `/raffle/${uuid}`;
            
            return {
                status: 'success',
                message: "Raffle created successfully",
                data: {
                    success: true,
                    message: "Raffle created successfully",
                    data: {
                        raffle_id: raffleId,
                        share_link: fullShareLink
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

export const useFormTicketAction = formAction$<TicketForm, TicketResponseData>(
    async (values) => {
        console.log('useFormTicketAction');
        console.log('values', values);
        
        const db = Drizzler();
        try {
            // Actualizar el número del sorteo
            await db
                .update(schema.raffleNumbers)
                .set({
                    buyerName: values.buyerName,
                    status: values.status,
                    paymentStatus: values.status === "sold-paid",
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(schema.raffleNumbers.raffleId, values.raffleId),
                        eq(schema.raffleNumbers.number, values.number)
                    )
                );
            
            return {
                status: 'success',
                message: "Ticket actualizado correctamente",
                data: {
                    success: true,
                    message: "Ticket actualizado correctamente",
                    data: {
                        ticket_id: values.number
                    }
                }
            } as FormActionResult<TicketForm, TicketResponseData>;
        } catch (error: any) {
            console.error("Error actualizando ticket: ", error);
            return {
                status: 'error',
                message: error.message
            } as FormActionResult<TicketForm, TicketResponseData>;
        }
    },
    valiForm$(TicketSchema)
); 