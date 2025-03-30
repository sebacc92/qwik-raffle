import { component$, useSignal, $, useVisibleTask$, useStylesScoped$, useComputed$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { toast } from 'qwik-sonner';
import { LuSearch, LuUsers, LuDollarSign, LuDownload, LuTrash2, LuCreditCard, LuGift } from '@qwikest/icons/lucide';
import { openDB, type LocalRaffle, type Ticket, type Prize } from '~/shared/indexedDB/config';
import LocalTicket from "~/components/raffle/localTicket";
import styles from '../../[uuid]/raffle.css?inline';

// Función para obtener un sorteo por su ID
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

                // Obtener los premios asociados
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

// Función para obtener los tickets de un sorteo
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

// Función para inicializar tickets
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

// Función para actualizar un ticket
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
                    // Si no existe el ticket, crearlo
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

    // Cargar el ID del sorteo desde los parámetros de ruta
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
        try {
            // Obtener el ID desde los parámetros de ruta
            const id = location.params.id;

            if (!id) {
                errorMessage.value = "No raffle ID provided";
                isLoading.value = false;
                return;
            }

            raffleId.value = Number(id);
            const raffleData = await getRaffleById(Number(id));

            if (!raffleData) {
                errorMessage.value = "Raffle not found";
                isLoading.value = false;
                return;
            }

            raffle.value = raffleData;

            // Intentar obtener tickets
            const ticketsData = await getTicketsForRaffle(Number(id));

            // Si no hay tickets, inicializar
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
            errorMessage.value = "Error loading raffle data";
            isLoading.value = false;
        }
    });

    // Función para generar enlace para clientes (en este caso, copiamos la URL actual)
    const generateClientLink = $(() => {
        if (!raffle.value) return;

        // Obtener números disponibles
        const availableNumbers = tickets.value
            .filter(t => t.status === "unsold")
            .map(t => t.number)
            .join(',');

        // Crear URL con todos los parámetros necesarios
        const params = new URLSearchParams({
            available: availableNumbers,
            name: encodeURIComponent(raffle.value.name),
            price: raffle.value.pricePerNumber.toString(),
            count: raffle.value.numberCount.toString(),
            prizes: encodeURIComponent((raffle.value.prizes ?? []).map(p => p.name).join('|') || '')
        });

        const link = `${window.location.href}client?${params.toString()}`;
        navigator.clipboard.writeText(link);
        toast.info("Link copied to clipboard");
    });

    const downloadRaffleInfo = $(() => {
        if (!raffle.value) return;

        let info = `Raffle Information: ${raffle.value.name}\n\n`;
        info += `Price per number: $${getPricePerNumber.value.toFixed(2)}\n`;
        info += `Total numbers: ${getNumberCount.value}\n`;

        const soldCount = tickets.value.filter(t => t.status !== "unsold").length;
        const paidCount = tickets.value.filter(t => t.status === "sold-paid").length;
        const totalCollected = paidCount * getPricePerNumber.value;

        info += `Sold numbers: ${soldCount}\n`;
        info += `Paid numbers: ${paidCount}\n`;
        info += `Total collected: $${totalCollected.toFixed(2)}\n\n`;
        info += "Prizes:\n";

        // Manejar el caso donde prizes podría ser undefined
        if (raffle.value.prizes && raffle.value.prizes.length > 0) {
            raffle.value.prizes.forEach((prize, index) => {
                info += `${index + 1}. ${prize.name}\n`;
            });
        } else {
            info += "No prizes registered\n";
        }

        info += "\nTicket details:\n";

        tickets.value.forEach(ticket => {
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

    // Función para resetear el sorteo
    const resetRaffle = $(async () => {
        if (!raffle.value || !raffleId.value) return;

        if (!confirm("Are you sure you want to reset all tickets? This will mark all tickets as unsold and remove buyer information.")) {
            return;
        }

        try {
            // Resetear todos los tickets
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
                // Actualizar tickets en la UI
                tickets.value = tickets.value.map(ticket => ({
                    ...ticket,
                    status: "unsold",
                    buyerName: null,
                    buyerPhone: null,
                    notes: null
                }));
                toast.success("Raffle has been reset");
            };
        } catch (error) {
            console.error('Error resetting raffle:', error);
            toast.error("Error resetting raffle");
        }
    });

    // Función para eliminar el sorteo completamente
    const deleteRaffle = $(async () => {
        if (!raffle.value || !raffleId.value) return;

        if (!confirm("Are you sure you want to delete this raffle? This action cannot be undone.")) {
            return;
        }

        try {
            const db = await openDB();
            
            // Eliminar todos los tickets asociados
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

            // Eliminar todos los premios asociados
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

            // Eliminar el sorteo
            const raffleTransaction = db.transaction(['raffles'], 'readwrite');
            const raffleStore = raffleTransaction.objectStore('raffles');
            await new Promise<void>((resolve, reject) => {
                const request = raffleStore.delete(raffleId.value!);
                request.onsuccess = () => resolve();
                request.onerror = () => reject();
            });

            db.close();
            toast.success("Raffle deleted successfully");
            // Redirigir al inicio
            navigate("/");
            
        } catch (error) {
            console.error('Error deleting raffle:', error);
            toast.error("Error deleting raffle");
        }
    });

    // Función auxiliar para obtener el precio por número de forma segura
    const getPricePerNumber = useComputed$(() => {
        return raffle.value?.pricePerNumber ?? 0;
    });

    // Función auxiliar para obtener el número total de tickets de forma segura
    const getNumberCount = useComputed$(() => {
        return raffle.value?.numberCount ?? 0;
    });

    // Calcular estadísticas
    const soldCount = tickets.value.filter(t => t.status !== "unsold").length;
    const paidCount = tickets.value.filter(t => t.status === "sold-paid").length;
    const totalCollected = paidCount * getPricePerNumber.value;

    // Renderizar mensaje de error si es necesario
    if (errorMessage.value) {
        return (
            <div class="p-4 max-w-7xl mx-auto">
                <h1 class="text-2xl font-bold text-purple-800">Error</h1>
                <p class="text-purple-600">{errorMessage.value}</p>
                <button
                    onClick$={() => navigate("/")}
                    class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                    Go Home
                </button>
            </div>
        );
    }

    // Renderizar pantalla de carga
    if (isLoading.value) {
        return (
            <div class="p-4 max-w-7xl mx-auto flex justify-center items-center min-h-[300px]">
                <div class="loading-spinner"></div>
                <p class="ml-3 text-purple-600">Loading raffle data...</p>
            </div>
        );
    }

    return (
        <div class="p-4 max-w-7xl mx-auto space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 class="text-2xl font-bold text-purple-800">{raffle.value?.name}</h1>
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                        onClick$={generateClientLink}
                        class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-purple-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        Copy Link
                    </button>
                    <button
                        onClick$={downloadRaffleInfo}
                        class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-purple-50 transition-colors"
                    >
                        <LuDownload class="w-4 h-4" />
                        Download Information
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="stats-card bg-white">
                    <div class="flex items-center gap-4">
                        <LuUsers class="w-6 h-6 text-purple-600" />
                        <div>
                            <div class="text-sm text-purple-600">Sold Tickets</div>
                            <div class="text-xl sm:text-2xl font-bold">
                                {soldCount}/{getNumberCount.value}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stats-card bg-white">
                    <div class="flex items-center gap-4">
                        <LuCreditCard class="w-6 h-6 text-purple-600" />
                        <div>
                            <div class="text-sm text-purple-600">Paid Tickets</div>
                            <div class="text-xl sm:text-2xl font-bold">
                                {paidCount}/{getNumberCount.value}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stats-card bg-white">
                    <div class="flex items-center gap-4">
                        <LuDollarSign class="w-6 h-6 text-purple-600" />
                        <div>
                            <div class="text-sm text-purple-600">Total Collected</div>
                            <div class="text-xl sm:text-2xl font-bold">
                                ${totalCollected.toFixed(2)}
                            </div>
                            <div class="text-xs text-purple-400">
                                Price per ticket: ${getPricePerNumber.value.toFixed(2)}
                            </div>
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
                        Show only pending ({tickets.value.filter(t => t.status === "sold-unpaid").length})
                    </label>
                </div>
            </div>

            <div class="ticket-container">
                <div class="ticket-grid">
                    {tickets.value
                        .filter(ticket =>
                            (!showOnlyPending.value || ticket.status === "sold-unpaid") &&
                            (!search.value ||
                                ticket.number.toString().includes(search.value) ||
                                (ticket.buyerName && ticket.buyerName.toLowerCase().includes(search.value.toLowerCase())))
                        )
                        .map(ticket => (
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
                    }
                </div>
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

            {/* Lista de premios */}
            {raffle.value?.prizes && raffle.value.prizes.length > 0 && (
                <div class="border rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <LuGift class="w-5 h-5 text-purple-600" />
                        <h3 class="font-semibold text-purple-800">Prizes</h3>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {raffle.value.prizes.map((prize, index) => (
                            <div 
                                key={index}
                                class="flex items-center gap-2 bg-purple-50 rounded-md p-3"
                            >
                                <span class="flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm font-medium">
                                    {index + 1}
                                </span>
                                <span class="text-purple-900">{prize.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div class="flex justify-center gap-4">
                <button
                    onClick$={resetRaffle}
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <LuTrash2 class="w-4 h-4" />
                    Reset Raffle
                </button>
                <button
                    onClick$={deleteRaffle}
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <LuTrash2 class="w-4 h-4" />
                    Delete Raffle
                </button>
            </div>
        </div>
    );
});

export const head: DocumentHead = () => {
    return {
        title: "Qwik Raffle - Local Raffle Management",
        meta: [
            {
                name: "description",
                content: "Manage your locally saved raffle",
            },
        ],
    };
};