import { component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useGetRaffle, useGetRaffleNumbers } from "~/shared/loaders";
import { LuGift } from '@qwikest/icons/lucide';
import styles from "./client.css?inline";
import { _ } from "compiled-i18n";

export { useGetRaffle, useGetRaffleNumbers } from "~/shared/loaders";

export default component$(() => {
    useStylesScoped$(styles);
    
    const raffle = useGetRaffle();
    const raffleNumbers = useGetRaffleNumbers();
    
    const search = useSignal("");
    
    // Check if raffle data is loaded
    if (raffle.value.failed) {
        return <div class="flex justify-center items-center min-h-screen text-purple-800 dark:text-purple-300">{_`The raffle does not exist or is not available.`}</div>;
    }

    // Calculate available numbers
    const availableNumbers = raffleNumbers.value
        .filter(ticket => ticket.status === "unsold")
        .map(ticket => ticket.number);
    
    const availableCount = availableNumbers.length;

    return (
        <div class="p-4 max-w-7xl mx-auto space-y-8">
            <div class="text-center space-y-3">
                <h1 class="text-3xl font-bold text-purple-800 dark:text-purple-300">{raffle.value.name}</h1>
                <p class="text-lg text-purple-600 dark:text-purple-400">
                    {_`Price per number: `}${raffle.value.pricePerNumber.toFixed(2)}
                </p>
                <p class="text-green-600 dark:text-green-400 font-semibold mt-1">
                    {availableCount} {_`numbers available of `}{raffle.value.numberCount}!
                </p>
            </div>

            {/* Prize list */}
            {raffle.value.prizes && raffle.value.prizes.length > 0 && (
                <div class="raffle-card p-6">
                    <div class="flex items-center gap-3 mb-5">
                        <LuGift class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <h2 class="text-2xl font-semibold text-purple-800 dark:text-purple-300">{_`Available Prizes`}</h2>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {raffle.value.prizes.map((prize) => (
                            <div 
                                key={prize.id}
                                class="prize-item flex items-center gap-3 p-4"
                            >
                                <span class="prize-position flex items-center justify-center w-8 h-8 text-white rounded-full text-lg font-medium">
                                    {prize.position}
                                </span>
                                <span class="text-purple-900 dark:text-purple-200 font-medium">{prize.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search input (optional) */}
            {raffle.value.numberCount > 50 && (
                <div class="relative w-full max-w-md mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-3 text-purple-500 dark:text-purple-400">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search number"
                        class="search-input pl-10 w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
                        value={search.value}
                        onInput$={(e: any) => search.value = e.target.value}
                    />
                </div>
            )}

            {/* Number grid */}
            <div class="raffle-card p-6">
                <h2 class="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-4">{_`Select your number`}</h2>
                <div class="ticket-grid">
                    {Array.from({ length: raffle.value.numberCount }, (_, i) => i + 1)
                        .filter(number => !search.value || number.toString().includes(search.value))
                        .map(number => {
                            const isAvailable = availableNumbers.includes(number);
                            return (
                                <div
                                    key={number}
                                    class={`ticket ${isAvailable ? 'available-ticket' : 'unavailable-ticket'}`}
                                >
                                    {number}
                                    {!isAvailable && (
                                        <div class="absolute inset-0 flex items-center justify-center">
                                            <svg class="w-full h-full unavailable-mark" viewBox="0 0 24 24">
                                                <path
                                                    d="M19 5L5 19M5.00001 5L19 19"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            {/* Contact information */}
            <div class="text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <p>{_`Contact the raffle organizer to reserve your numbers`}</p>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ resolveValue }) => {
    const raffle = resolveValue(useGetRaffle);
    return {
        title: _`Qwik Raffle - ${raffle.name || "View Available Numbers"}`,
        meta: [
            {
                name: "description",
                content: _`View and select available raffle numbers for ${raffle.name || ""}`,
            },
        ],
    };
};
