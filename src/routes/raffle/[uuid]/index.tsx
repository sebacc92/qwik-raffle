import { component$, useSignal, $, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { toast } from 'qwik-sonner';
import { useGetRaffle, useGetRaffleNumbers } from "~/shared/loaders";
import styles from './raffle.css?inline';
import Ticket from "~/components/raffle/ticket";
import { LuUsers, LuCreditCard, LuDollarSign, LuGift, LuSearch, LuLink, LuDownload, LuTrash2, LuTrophy, LuX } from '@qwikest/icons/lucide';
import { useNavigate } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";

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
    const navigate = useNavigate();

    const raffle = useGetRaffle();
    const raffleNumbers = useGetRaffleNumbers();
    
    const search = useSignal("");
    const showOnlyPending = useSignal(false);

    // Signals for draw functionality
    const showDrawConfirmation = useSignal(false);

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
        toast.info(_`Raffle information downloaded`);
    });

    // Function to start the draw process
    const startDrawProcess = $(() => {
        if (raffle.value.failed) return;
        
        if (!raffle.value.prizes || raffle.value.prizes.length === 0) {
            toast.error(_`This raffle has no registered prizes`, {
                duration: 3000,
                position: 'top-center'
            });
            return;
        }

        // Show confirmation modal
        showDrawConfirmation.value = true;
    });

    // Function to confirm and proceed with the draw
    const confirmDraw = $(() => {
        if (raffle.value.failed) return;

        // Filter tickets to only include paid tickets
        const paid = raffleNumbers.value.filter(t => t.status === "sold-paid");

        // Check if there are enough tickets
        const numberOfPrizes = raffle.value.prizes?.length || 0;
        if (paid.length < numberOfPrizes) {
            toast.error(_`There are not enough paid tickets to draw all the prizes`, {
                duration: 3000,
                position: 'top-center'
            });
            showDrawConfirmation.value = false;
            return;
        }

        // Hide confirmation and navigate to wheel page
        showDrawConfirmation.value = false;
        navigate(`/raffle/${raffle.value.uuid}/wheel`);
    });

    if(raffle.value.failed){
        return (
            <div class="p-4 max-w-7xl mx-auto">
                <h1 class="text-2xl font-bold text-purple-800">{_`Raffle not found`}</h1>
                <p class="text-purple-600">{_`The raffle you are looking for does not exist or has been deleted.`}</p>
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
                        <LuLink class="w-4 h-4" />
                        {_`Copy Link`}
                    </button>
                    <button
                        onClick$={downloadRaffleInfo}
                        class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-purple-50 transition-colors"
                    >
                        <LuDownload class="w-4 h-4" />
                        {_`Download Information`}
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="stats-card bg-white">
                    <div class="flex items-center gap-4">
                        <LuUsers class="w-6 h-6 text-purple-600" />
                        <div>
                            <div class="text-sm text-purple-600">{_`Sold Tickets`}</div>
                            <div class="text-xl sm:text-2xl font-bold">{soldCount}/{raffle.value.numberCount}</div>
                        </div>
                    </div>
                </div>

                <div class="stats-card bg-white">
                    <div class="flex items-center gap-4">
                        <LuCreditCard class="w-6 h-6 text-purple-600" />
                        <div>
                            <div class="text-sm text-purple-600">{_`Paid Tickets`}</div>
                            <div class="text-xl sm:text-2xl font-bold">{paidCount}/{raffle.value.numberCount}</div>
                        </div>
                    </div>
                </div>

                <div class="stats-card bg-white">
                    <div class="flex items-center gap-4">
                        <LuDollarSign class="w-6 h-6 text-purple-600" />
                        <div>
                            <div class="text-sm text-purple-600">{_`Total Collected`}</div>
                            <div class="text-xl sm:text-2xl font-bold">${totalCollected.toFixed(2)}</div>
                            <div class="text-xs text-purple-400">{_`Price per ticket: `}${raffle.value.pricePerNumber.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="relative w-full sm:w-auto sm:flex-1">
                    <LuSearch class="absolute left-2 top-2.5 text-purple-500 w-4 h-4" />
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
                        {_`Show only pending `}({raffleNumbers.value.filter(t => t.status === "sold-unpaid").length})
                    </label>
                </div>
            </div>

            <div class="ticket-container">
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
            </div>

            <div class="border rounded-lg p-4 space-y-2">
                <h3 class="font-semibold text-purple-800">{_`Color Reference`}</h3>
                <div class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-purple-200 rounded"></div>
                        <span>{_`Unsold`}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                        <span>{_`Sold (Pending payment)`}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                        <span>{_`Sold and paid`}</span>
                    </div>
                </div>
            </div>

            {/* Prizes list */}
            {raffle.value.prizes && raffle.value.prizes.length > 0 && (
                <div class="border rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <LuGift class="w-5 h-5 text-purple-600" />
                        <h3 class="font-semibold text-purple-800">{_`Prizes`}</h3>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {raffle.value.prizes.sort((a, b) => a.position - b.position).map((prize) => (
                            <div 
                                key={prize.id}
                                class="flex items-center gap-2 bg-purple-50 rounded-md p-3"
                            >
                                <span class="flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm font-medium">
                                    {prize.position}
                                </span>
                                <span class="text-purple-900">{prize.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div class="flex justify-center gap-4">
                <button
                    onClick$={startDrawProcess}
                    class="action-button success px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <LuTrophy class="w-4 h-4" />
                    {_`Finalize and Draw`}
                </button>
                <button
                    onClick$={() => {
                        if (confirm("Are you sure you want to reset the raffle? This will delete all data.")) {
                            // Aquí iría la lógica para resetear el sorteo
                            alert("Raffle reset");
                        }
                    }}
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <LuTrash2 class="w-4 h-4" />
                    {_`Reset Raffle`}
                </button>
            </div>

            {/* Confirmation modal for draw */}
            {showDrawConfirmation.value && (
                <div class="confirmation-dialog">
                    <div class="confirmation-content">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="confirmation-title">{_`Confirm Draw`}</h2>
                            <button
                                onClick$={() => showDrawConfirmation.value = false}
                                class="text-gray-500 hover:text-gray-700"
                            >
                                <LuX class="w-5 h-5" />
                            </button>
                        </div>
                        <p class="mb-4">
                            {_`Are you sure you want to finalize the raffle and draw ${raffle.value.prizes?.length || 0} prize(s)?`}
                        </p>
                        {!!raffleNumbers.value.filter(t => t.status === "sold-unpaid").length && (
                            <p class="mb-4 text-amber-600">
                                {_`There are ${raffleNumbers.value.filter(t => t.status === "sold-unpaid").length} ticket(s) with pending payment. These tickets will NOT be included in the draw.`}
                            </p>
                        )}
                        <div class="confirmation-actions">
                            <button
                                onClick$={() => showDrawConfirmation.value = false}
                                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                {_`Cancel`}
                            </button>
                            <button
                                onClick$={confirmDraw}
                                class="action-button success px-4 py-2 rounded-md transition-colors"
                            >
                                {_`Continue with the draw`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export const head: DocumentHead = ({ resolveValue }) => {
    const raffle = resolveValue(useGetRaffle);
    const title = raffle.failed
        ? raffle.errorMessage
        : _`Qwik Raffle - ${raffle.name}`;
    const description = raffle.failed
        ? _`Raffle not found`
        : _`Raffle details ${raffle.name}`;
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
