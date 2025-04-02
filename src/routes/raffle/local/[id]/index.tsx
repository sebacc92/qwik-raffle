import { component$, useSignal, $, useVisibleTask$, useStylesScoped$, useComputed$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { LuSearch, LuUsers, LuCreditCard, LuDollarSign, LuDownload, LuTrash2, LuGift, LuLink, LuAlertTriangle, LuX, LuTrophy } from '@qwikest/icons/lucide';
import { toast } from 'qwik-sonner';
import { openDB, type LocalRaffle, type Ticket, type Prize } from '~/shared/indexedDB/config';
import LocalTicket from "~/components/raffle/localTicket";
import RaffleWheel from "~/components/raffle/RaffleWheel";
import styles from '../../[uuid]/raffle.css?inline';
import { _ } from "compiled-i18n";

// Function to get a raffle by its ID
const getRaffleById = async (id: number): Promise<LocalRaffle | null> => {
    let db: IDBDatabase | null = null;
    try {
        db = await openDB();

        return new Promise<LocalRaffle | null>((resolve, reject) => {
            const transaction = db!.transaction(['raffles', 'prizes'], 'readonly');
            const raffleStore = transaction.objectStore('raffles');
            const prizeStore = transaction.objectStore('prizes');

            const raffleRequest = raffleStore.get(id);
            let raffle: LocalRaffle | null = null;
            let prizes: Prize[] = [];

            raffleRequest.onsuccess = () => {
                raffle = raffleRequest.result;
                if (!raffle) {
                    resolve(null);
                    return;
                }

                // Get associated prizes
                const prizeIndex = prizeStore.index('raffleId');
                const prizeRequest = prizeIndex.getAll(id);

                prizeRequest.onsuccess = () => {
                    prizes = prizeRequest.result;
                    if (!raffle || !raffle.name || !raffle.numberCount || !raffle.pricePerNumber) {
                        resolve(null);
                        return;
                    }
                    resolve({
                        id: raffle.id,
                        name: raffle.name,
                        description: raffle.description || '',
                        numberCount: raffle.numberCount,
                        pricePerNumber: raffle.pricePerNumber,
                        createdAt: raffle.createdAt,
                        updatedAt: raffle.updatedAt,
                        uuid: raffle.uuid,
                        prizes
                    });
                };
            };

            raffleRequest.onerror = () => {
                reject(new Error('Error getting raffle'));
            };

            transaction.oncomplete = () => {
                if (db) db.close();
            };
        });
    } catch (error) {
        console.error('Error in getRaffleById:', error);
        return null;
    } finally {
        if (db) db.close();
    }
};

// Function to get tickets for a raffle
const getTicketsForRaffle = async (raffleId: number): Promise<Ticket[]> => {
    let db: IDBDatabase | null = null;
    try {
        db = await openDB();

        return new Promise<Ticket[]>((resolve, reject) => {
            const transaction = db!.transaction(['tickets'], 'readonly');
            const store = transaction.objectStore('tickets');
            const index = store.index('raffleId');
            const request = index.getAll(raffleId);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error('Error getting tickets'));
            };

            transaction.oncomplete = () => {
                if (db) db.close();
            };
        });
    } catch (error) {
        console.error('Error in getTicketsForRaffle:', error);
        return [];
    } finally {
        if (db) db.close();
    }
};

// Function to initialize tickets
const initializeTicketsForRaffle = async (raffleId: number, ticketCount: number) => {
    let db: IDBDatabase | null = null;
    try {
        db = await openDB();
        const transaction = db.transaction(['tickets'], 'readwrite');
        const store = transaction.objectStore('tickets');

        const ticketsToAdd: Ticket[] = [];
        const now = new Date().toISOString();

        for (let i = 1; i <= ticketCount; i++) {
            ticketsToAdd.push({
                raffleId,
                number: i,
                status: "unsold",
                buyerName: null,
                buyerPhone: null,
                paymentStatus: false,
                notes: null,
                createdAt: now,
                updatedAt: now
            });
        }

        return new Promise<void>((resolve, reject) => {
            const processInBatches = (index = 0) => {
                const batch = ticketsToAdd.slice(index, index + 100);

                if (batch.length === 0) {
                    resolve();
                    return;
                }

                batch.forEach(ticket => store.add(ticket));
                setTimeout(() => processInBatches(index + 100), 0);
            };

            processInBatches();

            transaction.onerror = () => {
                reject(new Error('Error initializing tickets'));
            };

            transaction.oncomplete = () => {
                if (db) db.close();
            };
        });
    } catch (error) {
        console.error('Error in initializeTicketsForRaffle:', error);
        throw error;
    } finally {
        if (db) db.close();
    }
};

// Function to update a ticket
export const updateTicket = async (raffleId: number, number: number, data: Partial<Ticket>) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(['tickets'], 'readwrite');
        const store = transaction.objectStore('tickets');
        const index = store.index('raffleId_number');
        const keyRange = IDBKeyRange.only([raffleId, number]);
        const request = index.openCursor(keyRange);

        return new Promise<void>((resolve, reject) => {
            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    const ticket = cursor.value;
                    const updatedTicket = { ...ticket, ...data };
                    cursor.update(updatedTicket);
                    resolve();
                } else {
                    // If the ticket does not exist, create it
                    const newTicket = {
                        raffleId,
                        number,
                        status: data.status || "unsold",
                        buyerName: data.buyerName || null,
                        buyerPhone: data.buyerPhone || null,
                        notes: data.notes || null
                    };
                    store.add(newTicket);
                    resolve();
                }
            };

            request.onerror = () => {
                reject(new Error('Error updating ticket'));
            };

            transaction.oncomplete = () => {
                db.close();
            };
        });
    } catch (error) {
        console.error('Error in updateTicket:', error);
        throw error;
    }
};

// Skeleton loader component
const SkeletonLoader = component$(() => {
    return (
        <div class="p-4 max-w-7xl mx-auto space-y-6">
            {/* Skeleton for the title */}
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="skeleton h-8 w-64"></div>
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div class="skeleton h-10 w-32"></div>
                    <div class="skeleton h-10 w-48"></div>
                </div>
            </div>

            {/* Skeleton for the stats cards */}
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} class="p-4 rounded-lg border border-gray-200 bg-white">
                        <div class="flex items-center gap-4">
                            <div class="skeleton h-6 w-6 rounded-full"></div>
                            <div class="w-full">
                                <div class="skeleton h-4 w-24 mb-2"></div>
                                <div class="skeleton h-8 w-20"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Skeleton for the search bar */}
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="relative w-full sm:w-auto sm:flex-1">
                    <div class="skeleton h-10 w-full"></div>
                </div>
                <div class="skeleton h-6 w-40"></div>
            </div>

            {/* Skeleton for the tickets */}
            <div class="p-4 rounded-lg bg-purple-50">
                <div class="grid grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) gap-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} class="skeleton h-16 w-full max-w-[100px]"></div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default component$(() => {
    useStylesScoped$(styles);

    const navigate = useNavigate();
    const location = useLocation();
    const raffleId = useSignal<number | null>(null);
    const raffle = useSignal<LocalRaffle | null>(null);
    const tickets = useSignal<Ticket[]>([]);
    const isLoading = useSignal(true);
    const search = useSignal("");
    const showOnlyPending = useSignal(false);
    const errorMessage = useSignal("");

    // Signals for confirmation modals
    const showResetConfirmation = useSignal(false);
    const showDeleteConfirmation = useSignal(false);
    const deleteConfirmationInput = useSignal("");
    const isProcessing = useSignal(false);

    // Signals for draw functionality
    const showDrawConfirmation = useSignal(false);
    const showDrawingWheel = useSignal(false);
    const eligibleTickets = useSignal<Ticket[]>([]);

    // Load the raffle ID from the route parameters
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
        try {
            // Get the ID from the route parameters
            const id = location.params.id;

            if (!id) {
                errorMessage.value = _`No raffle ID provided`;
                isLoading.value = false;
                return;
            }

            raffleId.value = Number(id);
            const raffleData = await getRaffleById(Number(id));

            if (!raffleData) {
                errorMessage.value = _`Raffle not found`;
                isLoading.value = false;
                return;
            }

            raffle.value = raffleData;

            // Try to get tickets
            const ticketsData = await getTicketsForRaffle(Number(id));

            // If there are no tickets, initialize
            if (ticketsData.length === 0) {
                await initializeTicketsForRaffle(Number(id), raffleData.numberCount);
                const initializedTickets = await getTicketsForRaffle(Number(id));
                tickets.value = initializedTickets;
            } else {
                tickets.value = ticketsData;
            }

            isLoading.value = false;
        } catch (error) {
            console.error('Error loading raffle:', error);
            errorMessage.value = _`Error loading raffle data`;
            isLoading.value = false;
        }
    });

    // Function to generate client link (in this case, we copy the current URL)
    const generateClientLink = $(() => {
        if (!raffle.value) return;

        // Get available numbers
        const availableNumbers = tickets.value
            .filter(t => t.status === "unsold")
            .map(t => t.number)
            .join(',');

        // Create URL with all necessary parameters
        const params = new URLSearchParams({
            available: availableNumbers,
            name: encodeURIComponent(raffle.value.name),
            price: raffle.value.pricePerNumber.toString(),
            count: raffle.value.numberCount.toString(),
            prizes: encodeURIComponent((raffle.value.prizes ?? []).map(p => p.name).join('|') || '')
        });

        const link = `${window.location.href}client?${params.toString()}`;
        navigator.clipboard.writeText(link);
        toast.success(_`Link copied to clipboard!`, {
            duration: 2000,
            position: 'top-center',
            //@ts-ignore
            icon: '🔗'
        });
    });

    const downloadRaffleInfo = $(() => {
        if (!raffle.value) return;

        let info = `${_`Raffle Information`}: ${raffle.value.name}\n\n`;
        info += `${_`Price per number`}: $${getPricePerNumber.value.toFixed(2)}\n`;
        info += `${_`Total numbers`}: ${getNumberCount.value}\n`;

        const soldCount = tickets.value.filter(t => t.status !== "unsold").length;
        const paidCount = tickets.value.filter(t => t.status === "sold-paid").length;
        const totalCollected = paidCount * getPricePerNumber.value;

        info += `${_`Sold numbers`}: ${soldCount}\n`;
        info += `${_`Paid numbers`}: ${paidCount}\n`;
        info += `${_`Total collected`}: $${totalCollected.toFixed(2)}\n\n`;
        info += `${_`Prizes`}:\n`;

        // Handle the case where prizes could be undefined
        if (raffle.value.prizes && raffle.value.prizes.length > 0) {
            raffle.value.prizes.forEach((prize, index) => {
                info += `${index + 1}. ${prize.name}\n`;
            });
        } else {
            info += `${_`No prizes registered`}\n`;
        }

        info += `\n${_`Ticket details`}:\n`;

        tickets.value.forEach(ticket => {
            info += `${_`Number`} ${ticket.number}: `;
            switch (ticket.status) {
                case "unsold":
                    info += `${_`Unsold`}\n`;
                    break;
                case "sold-unpaid":
                    info += `${_`Reserved by`} ${ticket.buyerName} (${_`Pending payment`})\n`;
                    break;
                case "sold-paid":
                    info += `${_`Sold to`} ${ticket.buyerName}\n`;
                    break;
            }
        });

        const blob = new Blob([info], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sorteo_${raffle.value.name.replace(/\s+/g, "_")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(_`Raffle information downloaded`, {
            duration: 2000,
            position: 'top-center',
            //@ts-ignore
            icon: '📋'
        });
    });

    // Function to reset the raffle
    const resetRaffle = $(async () => {
        if (!raffle.value || !raffleId.value) return;

        isProcessing.value = true;

        try {
            // Reset all tickets
            const db = await openDB();
            const transaction = db.transaction(['tickets'], 'readwrite');
            const store = transaction.objectStore('tickets');
            const index = store.index('raffleId');
            const request = index.openCursor(raffleId.value);

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    const ticket = cursor.value;
                    ticket.status = "unsold";
                    ticket.buyerName = null;
                    ticket.buyerPhone = null;
                    ticket.notes = null;
                    cursor.update(ticket);
                    cursor.continue();
                }
            };

            transaction.oncomplete = () => {
                db.close();
                // Update tickets in the UI
                tickets.value = tickets.value.map(ticket => ({
                    ...ticket,
                    status: "unsold",
                    buyerName: null,
                    buyerPhone: null,
                    notes: null
                }));
                showResetConfirmation.value = false;
                isProcessing.value = false;
                toast.success(_`The raffle has been reset!`, {
                    duration: 3000,
                    position: 'top-center',
                    //@ts-ignore
                    icon: '🔄'
                });
            };
        } catch (error) {
            console.error('Error resetting raffle:', error);
            toast.error(_`Error resetting raffle`, {
                duration: 3000,
                position: 'top-center'
            });
            isProcessing.value = false;
            showResetConfirmation.value = false;
        }
    });

    // Function to completely delete the raffle
    const deleteRaffle = $(async () => {
        if (!raffle.value || !raffleId.value) return;

        // Verify if the text matches the raffle name
        if (deleteConfirmationInput.value !== raffle.value.name) {
            toast.error(_`The raffle name does not match`, {
                duration: 3000,
                position: 'top-center'
            });
            return;
        }

        isProcessing.value = true;

        try {
            const db = await openDB();

            // Delete all associated tickets
            const ticketTransaction = db.transaction(['tickets'], 'readwrite');
            const ticketStore = ticketTransaction.objectStore('tickets');
            const ticketIndex = ticketStore.index('raffleId');
            const ticketRequest = ticketIndex.openCursor(raffleId.value);

            await new Promise<void>((resolve, reject) => {
                ticketRequest.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    }
                };
                ticketTransaction.oncomplete = () => resolve();
                ticketTransaction.onerror = () => reject();
            });

            // Delete all associated prizes
            const prizeTransaction = db.transaction(['prizes'], 'readwrite');
            const prizeStore = prizeTransaction.objectStore('prizes');
            const prizeIndex = prizeStore.index('raffleId');
            const prizeRequest = prizeIndex.openCursor(raffleId.value);

            await new Promise<void>((resolve, reject) => {
                prizeRequest.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    }
                };
                prizeTransaction.oncomplete = () => resolve();
                prizeTransaction.onerror = () => reject();
            });

            // Delete the raffle
            const raffleTransaction = db.transaction(['raffles'], 'readwrite');
            const raffleStore = raffleTransaction.objectStore('raffles');
            await new Promise<void>((resolve, reject) => {
                const request = raffleStore.delete(raffleId.value!);
                request.onsuccess = () => resolve();
                request.onerror = () => reject();
            });

            db.close();
            toast.success(_`Raffle deleted successfully`, {
                duration: 3000,
                position: 'top-center',
                //@ts-ignore
                icon: '🗑️'
            });

            // Redirect to home
            navigate("/");

        } catch (error) {
            console.error('Error deleting raffle:', error);
            toast.error(_`Error deleting raffle`, {
                duration: 3000,
                position: 'top-center'
            });
            isProcessing.value = false;
            showDeleteConfirmation.value = false;
        }
    });

    // Helper function to safely get the price per number
    const getPricePerNumber = useComputed$(() => {
        return raffle.value?.pricePerNumber ?? 0;
    });

    // Helper function to safely get the total number of tickets
    const getNumberCount = useComputed$(() => {
        return raffle.value?.numberCount ?? 0;
    });

    // Calculate statistics
    const soldCount = tickets.value.filter(t => t.status !== "unsold").length;
    const paidCount = tickets.value.filter(t => t.status === "sold-paid").length;
    const totalCollected = paidCount * getPricePerNumber.value;

    // Function to start the draw process
    const startDrawProcess = $(() => {
        if (!raffle.value || !raffle.value.prizes || raffle.value.prizes.length === 0) {
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
        if (!raffle.value) return;

        // Filter tickets to only include paid tickets
        const paid = tickets.value.filter(t => t.status === "sold-paid");
        eligibleTickets.value = [...paid];

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

        // Hide confirmation and show wheel
        showDrawConfirmation.value = false;
        showDrawingWheel.value = true;
    });

    // Render error message if necessary
    if (errorMessage.value) {
        return (
            <div class="p-4 max-w-7xl mx-auto">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                    <LuAlertTriangle class="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h1 class="text-2xl font-bold text-purple-800 mb-2">{_`Error`}</h1>
                    <p class="text-purple-600 mb-6">{errorMessage.value}</p>
                    <button
                        onClick$={() => navigate("/")}
                        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                        {_`Back to home`}
                    </button>
                </div>
            </div>
        );
    }

    // Render loading screen (skeleton)
    if (isLoading.value) {
        return <SkeletonLoader />;
    }

    // Filter tickets based on search and filters
    const filteredTickets = tickets.value.filter(ticket =>
        (!showOnlyPending.value || ticket.status === "sold-unpaid") &&
        (!search.value ||
            ticket.number.toString().includes(search.value) ||
            (ticket.buyerName && ticket.buyerName.toLowerCase().includes(search.value.toLowerCase())))
    );

    return (
        <div class="p-4 max-w-7xl mx-auto space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 class="text-2xl font-bold text-purple-800">{raffle.value?.name}</h1>
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                        onClick$={generateClientLink}
                        class="action-button flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-purple-50 transition-colors"
                    >
                        <LuLink class="w-4 h-4" />
                        {_`Copy Link`}
                    </button>
                    <button
                        onClick$={downloadRaffleInfo}
                        class="action-button flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-purple-50 transition-colors"
                    >
                        <LuDownload class="w-4 h-4" />
                        {_`Download Information`}
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="stats-card">
                    <div class="flex items-center gap-4">
                        <LuUsers class="w-6 h-6 text-purple-600" />
                        <div>
                            <div class="text-sm text-purple-600">{_`Tickets Sold`}</div>
                            <div class="text-xl sm:text-2xl font-bold">
                                {soldCount}/{getNumberCount.value}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stats-card">
                    <div class="flex items-center gap-4">
                        <LuCreditCard class="w-6 h-6 text-purple-600" />
                        <div>
                            <div class="text-sm text-purple-600">{_`Tickets Paid`}</div>
                            <div class="text-xl sm:text-2xl font-bold">
                                {paidCount}/{getNumberCount.value}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stats-card">
                    <div class="flex items-center gap-4">
                        <LuDollarSign class="w-6 h-6 text-purple-600" />
                        <div>
                            <div class="text-sm text-purple-600">{_`Total Collected`}</div>
                            <div class="text-xl sm:text-2xl font-bold">
                                ${totalCollected.toFixed(2)}
                            </div>
                            <div class="text-xs text-purple-400">
                                {_`Price per ticket:`} ${getPricePerNumber.value.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="relative w-full sm:w-auto sm:flex-1">
                    <LuSearch class="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder={_`Search by number or name`}
                        class="pl-10 w-full border border-purple-200 rounded-md p-2 transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
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
                        class="rounded text-purple-600 focus:ring-purple-400"
                    />
                    <label for="pending" class="text-sm sm:text-base">
                        {_`Show only pending`} ({tickets.value.filter(t => t.status === "sold-unpaid").length})
                    </label>
                </div>
            </div>

            <div class="ticket-container rounded-lg">
                <div class="ticket-grid">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                            <LocalTicket
                                key={ticket.number}
                                ticket={ticket}
                                raffleId={raffleId.value || 0}
                                onUpdate$={() => {
                                    getTicketsForRaffle(raffleId.value || 0).then(newTickets => {
                                        tickets.value = newTickets;
                                    });
                                }}
                            />
                        ))
                    ) : (
                        <div class="col-span-full py-10 text-center text-purple-600">
                            {search.value || showOnlyPending.value ? (
                                <p>{_`No tickets found matching your search`}</p>
                            ) : (
                                <p>{_`No tickets available`}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div class="border rounded-lg p-4 space-y-2">
                <h3 class="font-semibold text-purple-800">{_`Color Reference`}</h3>
                <div class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-purple-200 bg-white rounded"></div>
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

            {/* Prize list */}
            {raffle.value?.prizes && raffle.value.prizes.length > 0 && (
                <div class="border rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <LuGift class="w-5 h-5 text-purple-600" />
                        <h3 class="font-semibold text-purple-800">{_`Prizes`}</h3>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {raffle.value.prizes.map((prize, index) => (
                            <div
                                key={index}
                                class="prize-item"
                            >
                                <div class="prize-number">{index + 1}</div>
                                <span class="text-purple-900 font-medium">{prize.name}</span>
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
                    onClick$={() => showResetConfirmation.value = true}
                    class="action-button warning px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <LuTrash2 class="w-4 h-4" />
                    {_`Reset Raffle`}
                </button>
                <button
                    onClick$={() => showDeleteConfirmation.value = true}
                    class="action-button danger px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <LuTrash2 class="w-4 h-4" />
                    {_`Delete Raffle`}
                </button>
            </div>

            {/* Confirmation modal for reset */}
            {showResetConfirmation.value && (
                <div class="confirmation-dialog">
                    <div class="confirmation-content">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="confirmation-title">{_`Confirm Reset`}</h2>
                            <button
                                onClick$={() => showResetConfirmation.value = false}
                                class="text-gray-500 hover:text-gray-700"
                            >
                                <LuX class="w-5 h-5" />
                            </button>
                        </div>
                        <p class="mb-4">{_`Are you sure you want to reset all tickets? This action will mark all tickets as unsold and delete buyer information.`}</p>

                        <div class="confirmation-actions">
                            <button
                                onClick$={() => showResetConfirmation.value = false}
                                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                disabled={isProcessing.value}
                            >
                                {_`Cancel`}
                            </button>
                            <button
                                onClick$={resetRaffle}
                                class="action-button warning px-4 py-2 rounded-md transition-colors"
                                disabled={isProcessing.value}
                            >
                                {isProcessing.value ? _`Processing...` : _`Yes, reset`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation modal for delete */}
            {showDeleteConfirmation.value && (
                <div class="confirmation-dialog">
                    <div class="confirmation-content">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="confirmation-title">{_`Confirm Deletion`}</h2>
                            <button
                                onClick$={() => showDeleteConfirmation.value = false}
                                class="text-gray-500 hover:text-gray-700"
                            >
                                <LuX class="w-5 h-5" />
                            </button>
                        </div>
                        <p class="mb-2">{_`This action will permanently delete the raffle and all its tickets. You will not be able to recover this data.`}</p>
                        <p class="mb-4 font-semibold">{_`To confirm, write the name of the raffle:`} <span class="text-purple-700">{raffle.value?.name}</span></p>

                        <input
                            type="text"
                            class="confirmation-input"
                            value={deleteConfirmationInput.value}
                            onInput$={(e: any) => deleteConfirmationInput.value = e.target.value}
                            placeholder={_`Write the exact name...`}
                        />

                        <div class="confirmation-actions">
                            <button
                                onClick$={() => showDeleteConfirmation.value = false}
                                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                disabled={isProcessing.value}
                            >
                                {_`Cancel`}
                            </button>
                            <button
                                onClick$={deleteRaffle}
                                class="action-button danger px-4 py-2 rounded-md transition-colors"
                                disabled={isProcessing.value || deleteConfirmationInput.value !== raffle.value?.name}
                            >
                                {isProcessing.value ? _`Processing...` : _`Yes, delete`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation modal for draw */}
            {showDrawConfirmation.value && (
                <div class="confirmation-dialog">
                    <div class="confirmation-content">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="confirmation-title">{_`Confirmar Sorteo`}</h2>
                            <button
                                onClick$={() => showDrawConfirmation.value = false}
                                class="text-gray-500 hover:text-gray-700"
                            >
                                <LuX class="w-5 h-5" />
                            </button>
                        </div>
                        <p class="mb-4">
                            {_`¿Estás seguro que deseas finalizar la rifa y sortear ${raffle.value?.prizes?.length || 0} premio(s)?`}
                        </p>
                        <p class="mb-4 text-amber-600">
                            {_`Hay ${tickets.value.filter(t => t.status === "sold-unpaid").length} boleto(s) con pago pendiente. Estos boletos NO serán incluidos en el sorteo.`}
                        </p>

                        <div class="confirmation-actions">
                            <button
                                onClick$={() => showDrawConfirmation.value = false}
                                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                {_`Cancelar`}
                            </button>
                            <button
                                onClick$={confirmDraw}
                                class="action-button success px-4 py-2 rounded-md transition-colors"
                            >
                                {_`Continuar con el sorteo`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Raffle Wheel Modal */}
            {showDrawingWheel.value && (
                <RaffleWheel
                    eligibleTickets={eligibleTickets.value}
                    numberOfPrizes={raffle.value?.prizes?.length || 0}
                    raffleName={raffle.value?.name || ""}
                    onClose$={$(() => showDrawingWheel.value = false)}
                />
            )}
        </div>
    );
});

export const head: DocumentHead = () => {
    return {
        title: _`Qwik Raffle - Local Raffle Management`,
        meta: [
            {
                name: "description",
                content: _`Manage your locally saved raffle`,
            },
        ],
    };
};