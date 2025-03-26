import { component$, useSignal, useVisibleTask$, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useGetRaffle } from "~/shared/loaders";
import styles from '../raffle.css?inline'; // Importamos los mismos estilos

export { useGetRaffle } from "~/shared/loaders";

// Tipos para los tickets/números del sorteo
interface Ticket {
    number: number;
    status: "unsold" | "sold-unpaid" | "sold-paid";
    buyerName?: string;
}

interface RaffleWithTickets {
    id: number;
    name: string;
    numberCount: number;
    pricePerNumber: number;
    uuid: string;
    tickets: Ticket[];
}

export default component$(() => {
    // Usamos los estilos desde el archivo externo
    useStylesScoped$(styles);

    const raffle = useGetRaffle();
    const raffleWithTickets = useSignal<RaffleWithTickets | null>(null);
    const search = useSignal("");

    // Inicializar los tickets con el estado actual
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        track(() => raffle.value);

        if (raffle.value) {
            // Crear array de tickets basado en numberCount
            const tickets: Ticket[] = [];
            for (let i = 1; i <= raffle.value.numberCount; i++) {
                tickets.push({
                    number: i,
                    status: "unsold" // Por defecto, todos están sin vender
                });
            }

            raffleWithTickets.value = {
                ...raffle.value,
                tickets
            };
        }
    });

    if (!raffleWithTickets.value) {
        return <div class="flex justify-center items-center min-h-screen">Cargando...</div>;
    }

    const availableCount = raffleWithTickets.value.tickets.filter(t => t.status === "unsold").length;

    return (
        <div class="p-4 max-w-7xl mx-auto space-y-6">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-purple-800">{raffleWithTickets.value.name}</h1>
                <p class="text-purple-600 mt-2">
                    Precio por número: ${raffleWithTickets.value.pricePerNumber.toFixed(2)}
                </p>
                <p class="text-green-600 font-semibold mt-1">
                    ¡{availableCount} números disponibles de {raffleWithTickets.value.numberCount}!
                </p>
            </div>

            <div class="relative w-full max-w-md mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-3 text-purple-500">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    placeholder="Buscar número"
                    class="pl-10 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={search.value}
                    onInput$={(e: any) => search.value = e.target.value}
                />
            </div>

            <div class="ticket-grid">
                {raffleWithTickets.value.tickets
                    .filter(ticket => 
                        !search.value || 
                        ticket.number.toString().includes(search.value)
                    )
                    .map(ticket => (
                        <div
                            key={ticket.number}
                            class={`ticket ${
                                ticket.status === 'unsold'
                                    ? 'ticket-unsold'
                                    : ticket.status === 'sold-unpaid'
                                        ? 'ticket-unpaid'
                                        : 'ticket-paid'
                            }`}
                        >
                            <span class="text-sm sm:text-lg font-semibold">{ticket.number}</span>
                        </div>
                    ))
                }
            </div>

            <div class="border rounded-lg p-4 space-y-2 max-w-md mx-auto">
                <h3 class="font-semibold text-center text-purple-800">Referencia de Colores</h3>
                <div class="flex flex-wrap justify-center gap-4">
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-purple-200 rounded"></div>
                        <span>Disponible</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                        <span>Reservado</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                        <span>Vendido</span>
                    </div>
                </div>
            </div>

            <div class="text-center text-sm text-gray-500 mt-8">
                <p>Para reservar un número, contacta al organizador del sorteo.</p>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ resolveValue }) => {
    const raffle = resolveValue(useGetRaffle);
    return {
        title: `Sorteo: ${raffle?.name || ""}`,
        meta: [
            {
                name: "description",
                content: `Ver números disponibles para el sorteo ${raffle?.name || ""}`,
            },
        ],
    };
};
