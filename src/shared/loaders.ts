import { routeLoader$ } from "@builder.io/qwik-city";
import Drizzler from "../../drizzle";

export const useGetRaffle = routeLoader$(async (requestEvent) => {
    const raffleUuid = requestEvent.params["uuid"];
    const db = Drizzler();
    const raffle = await db.query.raffles.findFirst({
        where: (raffles, { eq }) => eq(raffles.uuid, raffleUuid),
    });
    if (!raffle) {
        // Set the status to 404 if the raffle is not found
        requestEvent.status(404);
    }
    return raffle;
});