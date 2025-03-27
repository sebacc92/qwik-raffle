import { component$, useSignal, $, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { toast } from 'qwik-sonner';
import { useGetRaffle, useGetRaffleNumbers } from "~/shared/loaders";
import styles from './raffle.css?inline'; // Import styles
import Ticket from "~/components/raffle/ticket";

export { useGetRaffle, useGetRaffleNumbers } from "~/shared/loaders";

// Types for raffle tickets/numbers
export interface Ticket {
    id?: number;
    number: number;
    status: "unsold" | "sold-unpaid" | "sold-paid";
    buyerName: string | null;
    buyerPhone: string | null;
    paymentStatus?: boolean;
    notes: string | null;
}

export default component$(() => {
    useStylesScoped$(styles);

    const raffle = useGetRaffle();
    const raffleNumbers = useGetRaffleNumbers();
    
    const search = useSignal("");
    const showOnlyPending = useSignal(false);

    const generateClientLink = $(() => {
        if(raffle.value.failed) return;
        const link = `${window.location.origin}/raffle/${raffle.value.uuid}/client`;
        navigator.clipboard.writeText(link);
        toast.info("Link copied");
    });

    const downloadRaffleInfo = $(() => {
        if(raffle.value.failed) return;
        let info = `Raffle Information: ${raffle.value.name}\n\n`;
        info += `Price per number: $${raffle.value.pricePerNumber}\n`;
        info += `Total numbers: ${raffle.value.numberCount}\n`;

        const soldCount = raffleNumbers.value.filter(t => t.status !== "unsold").length;
        const paidCount = raffleNumbers.value.filter(t => t.status === "sold-paid").length;
        const totalCollected = paidCount * raffle.value.pricePerNumber;

        info += `Sold numbers: ${soldCount}\n`;
        info += `Paid numbers: ${paidCount}\n`;
        info += `Total collected: $${totalCollected.toFixed(2)}\n\n`;
        info += "Ticket details:\n";

        raffleNumbers.value.forEach(ticket => {
            info += `Number ${ticket.number}: `;
            switch (ticket.status) {
                case "unsold":
                    info += "Unsold\n";
                    break;
                case "sold-unpaid":
                    info += `Reserved by ${ticket.buyerName} (Pending payment)\n`;
                    break;
                case "sold-paid":
                    info += `Sold to ${ticket.buyerName}\n`;
                    break;
            }
        });

        const blob = new Blob([info], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `raffle_${raffle.value.name.replace(/\s+/g, "_")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.info("Raffle information downloaded");
    });

    if(raffle.value.failed){
        return (
            <div class="p-4 max-w-7xl mx-auto">
                <h1 class="text-2xl font-bold text-purple-800">Raffle not found</h1>
                <p class="text-purple-600">The raffle you are looking for does not exist or has been deleted.</p>
            </div>
        );
    }

    const soldCount = raffleNumbers.value.filter(t => t.status !== "unsold").length;
    const paidCount = raffleNumbers.value.filter(t => t.status === "sold-paid").length;
    const totalCollected = paidCount * raffle.value.pricePerNumber;

    return (
        <div class="p-4 max-w-7xl mx-auto space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 class="text-2xl font-bold text-purple-800">{raffle.value.name}</h1>
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                        onClick$={generateClientLink}
                        class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-purple-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        Generate Client Link
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
                        Download Information
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
                            <div class="text-sm text-purple-600">Sold Tickets</div>
                            <div class="text-xl sm:text-2xl font-bold">{soldCount}/{raffle.value.numberCount}</div>
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
                            <div class="text-sm text-purple-600">Paid Tickets</div>
                            <div class="text-xl sm:text-2xl font-bold">{paidCount}/{raffle.value.numberCount}</div>
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
                            <div class="text-sm text-purple-600">Total Collected</div>
                            <div class="text-xl sm:text-2xl font-bold">${totalCollected.toFixed(2)}</div>
                            <div class="text-xs text-purple-400">Price per ticket: ${raffle.value.pricePerNumber.toFixed(2)}</div>
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
                        placeholder="Search number or name"
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
                        Show only pending ({raffleNumbers.value.filter(t => t.status === "sold-unpaid").length})
                    </label>
                </div>
            </div>

            <div class="ticket-grid">
                {raffleNumbers.value
                    .filter(ticket =>
                        (!showOnlyPending.value || ticket.status === "sold-unpaid") &&
                        (!search.value ||
                            ticket.number.toString().includes(search.value) ||
                            ticket.buyerName?.toLowerCase().includes(search.value.toLowerCase()))
                    )
                    .map(ticket => (
                        <Ticket
                            key={ticket.number}
                            ticket={ticket}
                            raffleId={raffle.value.id || 0}
                        />
                    ))
                }
            </div>

            <div class="border rounded-lg p-4 space-y-2">
                <h3 class="font-semibold text-purple-800">Color Reference</h3>
                <div class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-purple-200 rounded"></div>
                        <span>Unsold</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                        <span>Sold (Pending payment)</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                        <span>Sold and paid</span>
                    </div>
                </div>
            </div>

            <div class="flex justify-center">
                <button
                    onClick$={() => {
                        if (confirm("Are you sure you want to reset the raffle? This will delete all data.")) {
                            // Aquí iría la lógica para resetear el sorteo
                            alert("Raffle reset");
                        }
                    }}
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                    Reset Raffle
                </button>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ resolveValue }) => {
    const raffle = resolveValue(useGetRaffle);
    const title = raffle.failed
        ? raffle.errorMessage
        : `Qwik Raffle - ${raffle.name}`;
    const description = raffle.failed
        ? "Raffle not found"
        : `Raffle details ${raffle.name}`;
    return {
        title,
        meta: [
            {
                name: "description",
                content: description,
            },
        ],
    };
};
