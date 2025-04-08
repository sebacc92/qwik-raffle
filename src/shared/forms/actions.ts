import { formAction$, valiForm$, type FormActionResult } from "@modular-forms/qwik";
import { type RaffleForm, type RaffleResponseData, RaffleSchema } from "~/schemas/raffleSchema";
import Drizzler from "../../../drizzle";
import { schema } from "../../../drizzle/schema";
import { v4 } from "uuid";
import { and, eq } from "drizzle-orm";
import { type TicketForm, type TicketResponseData, TicketSchema } from "~/schemas/ticketSchema";
import type { Session } from "~/types/session";
import { getUser } from "~/server";
import { _ } from "compiled-i18n";

export const useFormRaffleAction = formAction$<RaffleForm, RaffleResponseData>(
    async (values, e) => {
        const session = e.sharedMap.get("session") as Session | null;
        const userData = await getUser(session);
        const userId = userData?.[0]?.id;
        
        // Destructure prizes and expiresAt from values to handle them separately
        const { prizes, expiresAt: formExpiresAt, ...otherRaffleData } = values;
        
        // Create payload with DB-compatible types
        const payload: {
            name: string;
            description?: string;
            numberCount: number;
            pricePerNumber: number;
            isPublic: boolean;
            expiresAt: Date | null;
            uuid: string;
            creatorId: number | null;
        } = {
            ...otherRaffleData,
            expiresAt: null,
            uuid: v4(),
            creatorId: userId || null
        };
        
        // Process expiresAt string to Date if it exists and is valid
        if (formExpiresAt && formExpiresAt.trim() !== '') {
            try {
                const date = new Date(formExpiresAt);
                // Check if valid date
                if (!isNaN(date.getTime())) {
                    payload.expiresAt = date;
                }
            } catch (error) {
                console.error("Error parsing expiresAt date:", error);
                // Keep expiresAt as null if invalid
            }
        }
        
        const db = Drizzler();
        try {
            console.log("Creating raffle with payload:", payload);
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

            // Insert prizes if they exist
            if (prizes && prizes.length > 0) {
                const prizesData = prizes.map((prize, index) => ({
                    raffleId,
                    name: prize.name,
                    position: index + 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));
                
                await db.insert(schema.prizes).values(prizesData);
            }
            
            const fullShareLink = `/raffle/${uuid}`;
            
            return {
                status: 'success',
                message: _`Raffle created successfully`,
                data: {
                    success: true,
                    message: _`Raffle created successfully`,
                    data: {
                        raffle_id: raffleId,
                        share_link: fullShareLink
                    }
                }
            } as FormActionResult<RaffleForm, RaffleResponseData>;
        } catch (error: any) {
            console.error(_`Error creating raffle: `, error);
            return {
                status: 'error',
                message: error.message
            } as FormActionResult<RaffleForm, RaffleResponseData>;
        }
    },
    valiForm$(RaffleSchema)
);

export const useFormTicketAction = formAction$<TicketForm, TicketResponseData>(
    async (values) => {
        
        const db = Drizzler();
        try {
            await db
                .update(schema.raffleNumbers)
                .set({
                    buyerName: values.buyerName,
                    buyerPhone: values.buyerPhone || null,
                    notes: values.notes || null,
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
                message: _`Ticket updated successfully`,
                data: {
                    success: true,
                    message: _`Ticket updated successfully`,
                    data: {
                        ticket_id: values.number
                    }
                }
            } as FormActionResult<TicketForm, TicketResponseData>;
        } catch (error: any) {
            console.error(_`Error updating ticket: `, error);
            return {
                status: 'error',
                message: error.message
            } as FormActionResult<TicketForm, TicketResponseData>;
        }
    },
    valiForm$(TicketSchema)
);