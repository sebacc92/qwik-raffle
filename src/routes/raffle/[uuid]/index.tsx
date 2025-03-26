import { component$, useSignal, useVisibleTask$, $, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useGetRaffle } from "~/shared/loaders";
import { Button, Modal, Input, Label } from '~/components/ui';
import { LuX } from '@qwikest/icons/lucide';
import styles from './raffle.css?inline'; // Importamos los estilos

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
    const showOnlyPending = useSignal(false);
    const showModal = useSignal(false);
    const selectedTicket = useSignal<Ticket | null>(null);
    const tempBuyerName = useSignal('');
    const tempPaymentStatus = useSignal<"sold-paid" | "sold-unpaid" | "unsold">("unsold");

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

    // Funciones para interacción
    const generateClientLink = $(() => {
        if (!raffleWithTickets.value) return;

        const link = `${window.location.origin}/raffle/${raffleWithTickets.value.uuid}`;
        navigator.clipboard.writeText(link);
        alert("Enlace copiado al portapapeles");
    });

    const downloadRaffleInfo = $(() => {
        if (!raffleWithTickets.value) return;

        let info = `Información del Sorteo: ${raffleWithTickets.value.name}\n\n`;
        info += `Precio por número: $${raffleWithTickets.value.pricePerNumber}\n`;
        info += `Total de números: ${raffleWithTickets.value.numberCount}\n`;

        const soldCount = raffleWithTickets.value.tickets.filter(t => t.status !== "unsold").length;
        const paidCount = raffleWithTickets.value.tickets.filter(t => t.status === "sold-paid").length;
        const totalCollected = paidCount * raffleWithTickets.value.pricePerNumber;

        info += `Números vendidos: ${soldCount}\n`;
        info += `Números pagados: ${paidCount}\n`;
        info += `Total recaudado: $${totalCollected.toFixed(2)}\n\n`;
        info += "Detalle de números:\n";

        raffleWithTickets.value.tickets.forEach(ticket => {
            info += `Número ${ticket.number}: `;
            switch (ticket.status) {
                case "unsold":
                    info += "No vendido\n";
                    break;
                case "sold-unpaid":
                    info += `Reservado por ${ticket.buyerName} (Pendiente de pago)\n`;
                    break;
                case "sold-paid":
                    info += `Vendido a ${ticket.buyerName}\n`;
                    break;
            }
        });

        const blob = new Blob([info], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sorteo_${raffleWithTickets.value.name.replace(/\s+/g, "_")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("Información del sorteo descargada");
    });

    const handleTicketClick = $((ticket: Ticket) => {
        console.log('ticket', ticket);
        selectedTicket.value = ticket;

        // Inicializar valores temporales según el ticket seleccionado
        tempBuyerName.value = ticket.buyerName || '';
        tempPaymentStatus.value = ticket.status;

        // Mostrar el modal
        console.log('HEY!')
        showModal.value = true;
    });

    const saveTicketChanges = $(() => {
        if (!selectedTicket.value) return;

        // Si el estado es "unsold", limpiar el nombre del comprador
        if (tempPaymentStatus.value === "unsold") {
            selectedTicket.value.buyerName = undefined;
        } else {
            // Si se asigna a alguien, actualizar el nombre
            selectedTicket.value.buyerName = tempBuyerName.value;
        }

        // Actualizar el estado del ticket
        selectedTicket.value.status = tempPaymentStatus.value;

        // Forzar actualización
        raffleWithTickets.value = { ...raffleWithTickets.value! };

        // Cerrar el modal
        showModal.value = false;
    });

    if (!raffleWithTickets.value) {
        return <div class="flex justify-center items-center min-h-screen">Cargando...</div>;
    }

    const soldCount = raffleWithTickets.value.tickets.filter(t => t.status !== "unsold").length;
    const paidCount = raffleWithTickets.value.tickets.filter(t => t.status === "sold-paid").length;
    const totalCollected = paidCount * raffleWithTickets.value.pricePerNumber;

    return (
        <>
            <div class="p-4 max-w-7xl mx-auto space-y-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 class="text-2xl font-bold text-purple-800">{raffleWithTickets.value.name}</h1>
                    <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            onClick$={generateClientLink}
                            class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-purple-50 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            Generar Enlace para Clientes
                        </button>
                        <button
                            onClick$={downloadRaffleInfo}
                            class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-purple-50 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Descargar Información
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="stats-card bg-white">
                        <div class="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <div>
                                <div class="text-sm text-purple-600">Números Vendidos</div>
                                <div class="text-xl sm:text-2xl font-bold">{soldCount}/{raffleWithTickets.value.numberCount}</div>
                            </div>
                        </div>
                    </div>

                    <div class="stats-card bg-white">
                        <div class="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            <div>
                                <div class="text-sm text-purple-600">Números Pagados</div>
                                <div class="text-xl sm:text-2xl font-bold">{paidCount}/{raffleWithTickets.value.numberCount}</div>
                            </div>
                        </div>
                    </div>

                    <div class="stats-card bg-white">
                        <div class="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="8 14 12 18 16 14"></polyline>
                                <line x1="12" y1="6" x2="12" y2="18"></line>
                            </svg>
                            <div>
                                <div class="text-sm text-purple-600">Total Recaudado</div>
                                <div class="text-xl sm:text-2xl font-bold">${totalCollected.toFixed(2)}</div>
                                <div class="text-xs text-purple-400">Valor por número: ${raffleWithTickets.value.pricePerNumber.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="relative w-full sm:w-auto sm:flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-2 top-2.5 text-purple-500">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar número o nombre"
                            class="pl-8 w-full border rounded-md p-2"
                            value={search.value}
                            onInput$={(e: any) => search.value = e.target.value}
                        />
                    </div>
                    <div class="flex items-center gap-2 w-full sm:w-auto">
                        <input
                            type="checkbox"
                            id="pending"
                            checked={showOnlyPending.value}
                            onChange$={() => showOnlyPending.value = !showOnlyPending.value}
                        />
                        <label for="pending" class="text-sm sm:text-base">
                            Mostrar solo pendientes ({raffleWithTickets.value.tickets.filter(t => t.status === "sold-unpaid").length})
                        </label>
                    </div>
                </div>

                <div class="ticket-grid">
                    {raffleWithTickets.value.tickets
                        .filter(ticket =>
                            (!showOnlyPending.value || ticket.status === "sold-unpaid") &&
                            (!search.value ||
                                ticket.number.toString().includes(search.value) ||
                                ticket.buyerName?.toLowerCase().includes(search.value.toLowerCase()))
                        )
                        .map(ticket => (
                            <div
                                key={ticket.number}
                                onClick$={() => handleTicketClick(ticket)}
                                class={`ticket ${ticket.status === 'unsold'
                                    ? 'ticket-unsold'
                                    : ticket.status === 'sold-unpaid'
                                        ? 'ticket-unpaid'
                                        : 'ticket-paid'
                                    }`}
                            >
                                <span class="text-sm sm:text-lg font-semibold">{ticket.number}</span>
                                {ticket.buyerName && (
                                    <span class="buyer-name">
                                        {ticket.buyerName}
                                    </span>
                                )}
                            </div>
                        ))
                    }
                </div>

                <div class="border rounded-lg p-4 space-y-2">
                    <h3 class="font-semibold text-purple-800">Referencia de Colores</h3>
                    <div class="flex flex-wrap gap-4">
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 border-2 border-purple-200 rounded"></div>
                            <span>No vendido</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                            <span>Vendido (Falta pagar)</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                            <span>Vendido y pagado</span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center">
                    <button
                        onClick$={() => {
                            if (confirm("¿Estás seguro de que quieres resetear el sorteo? Esto eliminará todos los datos.")) {
                                // Aquí iría la lógica para resetear el sorteo
                                alert("Sorteo reseteado");
                            }
                        }}
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Resetear Sorteo
                    </button>
                </div>
            </div>
            {/* Modal para editar ticket */}
            <Modal.Root bind:show={showModal}>
                <Modal.Panel>
                    <Modal.Close onClick$={() => showModal.value = false}>
                        <LuX class="h-5 w-5" />
                    </Modal.Close>
                    <Modal.Title>
                        Editar Número {selectedTicket.value?.number}
                    </Modal.Title>
                    <Modal.Description>
                        Actualizar información del número seleccionado
                    </Modal.Description>

                    <div class="space-y-4 py-4">
                        <div>
                            <Label for="buyerName">Nombre del comprador</Label>
                            <Input
                                id="buyerName"
                                type="text"
                                bind:value={tempBuyerName}
                                placeholder="Nombre del comprador"
                                class="w-full"
                                disabled={tempPaymentStatus.value === "unsold"}
                            />
                        </div>

                        <div class="space-y-2">
                            <Label>Estado del número</Label>

                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="status-unsold"
                                        name="ticketStatus"
                                        checked={tempPaymentStatus.value === "unsold"}
                                        onClick$={() => tempPaymentStatus.value = "unsold"}
                                    />
                                    <label for="status-unsold">No vendido</label>
                                </div>

                                <div class="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="status-unpaid"
                                        name="ticketStatus"
                                        checked={tempPaymentStatus.value === "sold-unpaid"}
                                        onClick$={() => tempPaymentStatus.value = "sold-unpaid"}
                                    />
                                    <label for="status-unpaid">Vendido - Pendiente de pago</label>
                                </div>

                                <div class="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="status-paid"
                                        name="ticketStatus"
                                        checked={tempPaymentStatus.value === "sold-paid"}
                                        onClick$={() => tempPaymentStatus.value = "sold-paid"}
                                    />
                                    <label for="status-paid">Vendido - Pagado</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer class="flex justify-end gap-2 pt-4">
                        <Button
                            look="secondary"
                            onClick$={() => showModal.value = false}
                        >
                            Cancelar
                        </Button>
                        <Button
                            look="primary"
                            onClick$={saveTicketChanges}
                            disabled={tempPaymentStatus.value !== "unsold" && !tempBuyerName.value}
                        >
                            Guardar Cambios
                        </Button>
                    </footer>

                </Modal.Panel>
            </Modal.Root>
        </>
    );
});

export const head: DocumentHead = ({ resolveValue }) => {
    const raffle = resolveValue(useGetRaffle);
    return {
        title: `Qwik Raffle - Sorteo ${raffle?.name || ""}`,
        meta: [
            {
                name: "description",
                content: `Detalles del sorteo ${raffle?.name || ""}`,
            },
        ],
    };
};
