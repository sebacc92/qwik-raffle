import { component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LuGift } from '@qwikest/icons/lucide';
import styles from "./client.css?inline";

interface Prize {
    name: string;
}

interface RaffleInfo {
    name: string;
    pricePerNumber: number;
    numberCount: number;
    prizes: Prize[];
}

export default component$(() => {
    useStylesScoped$(styles);

    const location = useLocation();
    const raffle = useSignal<RaffleInfo | null>(null);
    const availableNumbers = useSignal<number[]>([]);
    const errorMessage = useSignal("");

    // Get all the information from the queries
    const searchParams = new URLSearchParams(location.url.search);
    const available = searchParams.get('available');
    const name = searchParams.get('name');
    const price = searchParams.get('price');
    const count = searchParams.get('count');
    const prizes = searchParams.get('prizes');

    // Validate and process the parameters
    if (!available || !name || !price || !count || !prizes) {
        errorMessage.value = "Invalid raffle link. Please contact the organizer.";
    } else {
        // Initialize the raffle data
        raffle.value = {
            name: decodeURIComponent(name),
            pricePerNumber: parseFloat(price),
            numberCount: parseInt(count),
            prizes: decodeURIComponent(prizes).split('|').map(name => ({ name }))
        };
        availableNumbers.value = available.split(',').map(Number);
    }

    if (errorMessage.value) {
        return (
            <div class="p-4 max-w-7xl mx-auto">
                <h1 class="text-2xl font-bold text-purple-800 dark:text-purple-300">Error</h1>
                <p class="text-purple-600 dark:text-purple-400">{errorMessage.value}</p>
            </div>
        );
    }

    const availableCount = availableNumbers.value.length;

    return (
        <div class="p-4 max-w-7xl mx-auto space-y-8">
            <div class="text-center space-y-3">
                <h1 class="text-3xl font-bold text-purple-800 dark:text-purple-300">{raffle.value?.name}</h1>
                <p class="text-lg text-purple-600 dark:text-purple-400">
                    Price per number: ${raffle.value?.pricePerNumber.toFixed(2)}
                </p>
                <p class="text-green-600 dark:text-green-400 font-semibold mt-1">
                    {availableCount} numbers available of {raffle.value?.numberCount}!
                </p>
            </div>

            {/* Prize list */}
            {raffle.value?.prizes && raffle.value.prizes.length > 0 && (
                <div class="raffle-card p-6">
                    <div class="flex items-center gap-3 mb-5">
                        <LuGift class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <h2 class="text-2xl font-semibold text-purple-800 dark:text-purple-300">Available Prizes</h2>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {raffle.value.prizes.map((prize, index) => (
                            <div 
                                key={index}
                                class="prize-item flex items-center gap-3 p-4"
                            >
                                <span class="prize-position flex items-center justify-center w-8 h-8 text-white rounded-full text-lg font-medium">
                                    {index + 1}
                                </span>
                                <span class="text-purple-900 dark:text-purple-200 font-medium">{prize.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Number grid */}
            <div class="raffle-card p-6">
                <h2 class="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-4">Select your number</h2>
                <div class="ticket-grid">
                    {Array.from({ length: raffle.value?.numberCount || 0 }, (_, i) => i + 1).map(number => {
                        const isAvailable = availableNumbers.value.includes(number);
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
                    })}
                </div>
            </div>

            {/* Contact information */}
            <div class="text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <p>Contact the raffle organizer to reserve your numbers</p>
            </div>
        </div>
    );
});

export const head: DocumentHead = () => {
    return {
        title: "Qwik Raffle - View Available Numbers",
        meta: [
            {
                name: "description",
                content: "View and select available raffle numbers",
            },
        ],
    };
};
