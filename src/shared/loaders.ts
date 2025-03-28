import { routeLoader$ } from "@builder.io/qwik-city";
import Drizzler from "../../drizzle";

// Tipo para los números del sorteo
export interface RaffleNumber {
    id: number;
    raffleId: number;
    number: number;
    buyerName: string | null;
    buyerPhone: string | null;
    status: "unsold" | "sold-unpaid" | "sold-paid";
    paymentStatus: boolean;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Tipo para el sorteo
export interface RaffleData {
    id: number;
    name: string;
    numberCount: number;
    pricePerNumber: number;
    uuid: string;
    creatorId: number | null;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    isTemporary: boolean;
    prizes: {
        id: number;
        name: string;
        description: string | null;
        position: number;
        imageUrl: string | null;
    }[];
}

export const useGetRaffle = routeLoader$(async (requestEvent) => {
    const raffleUuid = requestEvent.params["uuid"];
    const db = Drizzler();
    
    // Primero obtenemos el sorteo
    const raffle = await db.query.raffles.findFirst({
        where: (raffles, { eq }) => eq(raffles.uuid, raffleUuid),
    });

    if (!raffle) {
        // Return a failed value to indicate that product was not found
        return requestEvent.fail(404, {
            errorMessage: `Raffle with UUID ${raffleUuid} not found`,
        });
    }

    // Luego obtenemos los premios
    const prizes = await db.query.prizes.findMany({
        where: (prizes, { eq }) => eq(prizes.raffleId, raffle.id),
    });

    // Combinamos los resultados
    return {
        ...raffle,
        prizes: prizes
    } as RaffleData;
});

export const useGetRaffleNumbers = routeLoader$(async (requestEvent) => {
    const raffleUuid = requestEvent.params["uuid"];
    const db = Drizzler();
    
    // Primero obtenemos el ID del raffle usando el UUID
    const raffle = await db.query.raffles.findFirst({
        where: (raffles, { eq }) => eq(raffles.uuid, raffleUuid),
        columns: { id: true }
    });
    
    if (!raffle) {
        return [];
    }
    
    // Ahora consultamos los números asociados a ese raffle
    const numbers = await db.query.raffleNumbers.findMany({
        where: (raffleNumbers, { eq }) => eq(raffleNumbers.raffleId, raffle.id),
    });
    
    return numbers as RaffleNumber[];
});