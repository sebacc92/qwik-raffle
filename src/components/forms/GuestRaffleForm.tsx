import { $, component$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city'
import { LuTrash, LuPlus, LuInfo } from '@qwikest/icons/lucide';
import { toast } from 'qwik-sonner';
import { openDB } from '~/shared/indexedDB/config';

// Interface for Prize
interface Prize {
    name: string;
    error: string;
}

// Interface for Form Data
interface RaffleFormData {
    name: string;
    description: string;
    ticketCount: number;
    ticketPrice: number;
    prizes: Prize[];
}

// Interface for Form Errors
interface FormErrors {
    name: string;
    ticketCount: string;
    ticketPrice: string;
    general: string;
}

// Function to save the raffle in IndexedDB
const saveRaffle = async (raffleData: RaffleFormData) => {
    let db: IDBDatabase | null = null;
    try {
        const now = new Date().toISOString();
        
        // 1. Crear una copia limpia de los datos para evitar problemas de serialización
        const cleanData = {
            name: raffleData.name,
            description: raffleData.description,
            numberCount: raffleData.ticketCount,
            pricePerNumber: raffleData.ticketPrice,
            createdAt: now,
            updatedAt: now,
            uuid: crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`
        };

        db = await openDB();
        
        // Primero guardamos el sorteo
        const savedId = await new Promise<IDBValidKey>((resolve, reject) => {
            const transaction = db!.transaction(['raffles'], 'readwrite');
            const store = transaction.objectStore('raffles');
            
            const request = store.add(cleanData);
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(new Error('Error saving raffle'));
            };
            
            transaction.oncomplete = () => {
                // No cerramos la DB aquí porque necesitamos guardar los premios
            };
        });

        // Luego guardamos los premios en una transacción separada
        await new Promise<void>((resolve, reject) => {
            const transaction = db!.transaction(['prizes'], 'readwrite');
            const store = transaction.objectStore('prizes');
            
            const validPrizes = raffleData.prizes.filter(prize => prize.name.trim() !== '');
            
            let completed = 0;
            const total = validPrizes.length;
            
            validPrizes.forEach(prize => {
                const request = store.add({
                    raffleId: savedId,
                    name: prize.name,
                    createdAt: now
                });
                
                request.onsuccess = () => {
                    completed++;
                    if (completed === total) {
                        resolve();
                    }
                };
                
                request.onerror = () => {
                    reject(new Error('Error saving prizes'));
                };
            });
            
            transaction.oncomplete = () => {
                resolve();
            };
        });

        return savedId;
    } catch (error) {
        console.error('Error en saveRaffle:', error);
        throw error;
    } finally {
        if (db) {
            db.close();
        }
    }
};

export const InfoAlert = component$(() => {
    return (
        <div class="w-full max-w-[550px] mx-auto mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div class="flex items-start">
                <div class="flex-shrink-0 mt-0.5">
                    <LuInfo class="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">Important information about your raffle</h3>
                    <ul class="mt-2 text-sm text-blue-700 dark:text-blue-400 list-disc pl-5 space-y-1">
                        <li>This raffle will be saved locally in your browser using IndexedDB.</li>
                        <li>You can only access it from this same device and browser.</li>
                        <li>If you delete your browser data, change devices, or use a different browser, <strong>you will lose the raffle data</strong>.</li>
                        <li>To save raffles on multiple devices and browsers, <strong>register for free</strong> to unlock additional features.</li>
                        <li>Registered users can create raffles with up to 1,000 tickets (the guest limit is 100).</li>
                        <li>The application is not responsible for any loss of locally saved raffle data.</li>
                    </ul>
                    <div class="mt-4">
                        <a href="/register" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Register for Free
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default component$(() => {
    // Form state using useStore for a complex object
    const formData = useStore<RaffleFormData>({
        name: '',
        description: '',
        ticketCount: 10,
        ticketPrice: 1.00,
        prizes: [{ name: '', error: '' }]
    });

    // Form errors state
    const errors = useStore<FormErrors>({
        name: '',
        ticketCount: '',
        ticketPrice: '',
        general: ''
    });

    // State for the success message
    const successMessage = useSignal<string>('');

    // State to indicate when the raffle is being saved
    const isSaving = useSignal<boolean>(false);

    // Check if IndexedDB is available
    const isIndexedDBAvailable = useSignal<boolean>(true);

    // Check IndexedDB availability when the component loads
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        if (!window.indexedDB) {
            isIndexedDBAvailable.value = false;
        }
    });

    // Function to validate the form
    const validateForm = $(() => {
        let isValid = true;

        // Validate raffle name
        if (!formData.name.trim()) {
            errors.name = 'The raffle name is required';
            isValid = false;
        } else if (formData.name.length > 100) {
            errors.name = 'The raffle name cannot exceed 100 characters';
            isValid = false;
        } else {
            errors.name = '';
        }

        // Validate description
        if (formData.description.length > 500) {
            errors.general = 'The description cannot exceed 500 characters';
            isValid = false;
        } else {
            errors.general = '';
        }

        // Validate number of tickets
        if (formData.ticketCount < 1) {
            errors.ticketCount = 'The minimum number of tickets is 1';
            isValid = false;
        } else if (formData.ticketCount > 100) {
            errors.ticketCount = 'As a guest, the maximum number of tickets is 100';
            isValid = false;
        } else {
            errors.ticketCount = '';
        }

        // Validate ticket price
        if (formData.ticketPrice < 0.01) {
            errors.ticketPrice = 'The minimum price is 0.01';
            isValid = false;
        } else if (formData.ticketPrice > 1000000) {
            errors.ticketPrice = 'The maximum price is 1,000,000';
            isValid = false;
        } else {
            errors.ticketPrice = '';
        }

        // Validate prizes
        let hasValidPrize = false;
        formData.prizes.forEach((prize, index) => {
            if (!prize.name.trim()) {
                formData.prizes[index].error = 'The prize name is required';
                isValid = false;
            } else if (prize.name.length > 100) {
                formData.prizes[index].error = 'The prize name cannot exceed 100 characters';
                isValid = false;
            } else {
                formData.prizes[index].error = '';
                hasValidPrize = true;
            }
        });

        if (!hasValidPrize) {
            errors.general = 'You must add at least one valid prize';
            isValid = false;
        }

        return isValid;
    });

    // Function to add a prize
    const addPrize = $(() => {
        if (formData.prizes.length < 10) {
            formData.prizes.push({ name: '', error: '' });
        }
    });

    // Function to remove a prize
    const removePrize = $((index: number) => {
        if (formData.prizes.length > 1) {
            formData.prizes.splice(index, 1);
        }
    });

    // Function to handle form submission
    const handleSubmit = $(async (e: Event) => {
        e.preventDefault();
        
        successMessage.value = '';
        errors.general = '';

        const isValid = await validateForm();

        if (isValid) {
            try {
                isSaving.value = true;
                
                const validPrizes = formData.prizes.filter(prize => prize.name.trim() !== '');
                if (validPrizes.length === 0) {
                    errors.general = 'You must add at least one valid prize';
                    return;
                }
                
                const dataToSave = {
                    ...formData,
                    prizes: validPrizes
                };
                
                const savedId = await saveRaffle(dataToSave);
                
                if (!savedId) {
                    throw new Error('No ID returned after saving raffle');
                }

                toast.success("Raffle created successfully! It has been saved locally in your browser.");

                // Pequeño delay para asegurar que el toast se muestre
                await new Promise(resolve => setTimeout(resolve, 1000));
                window.location.href = `/raffle/local/${savedId}`;
                
            } catch (error) {
                console.error('Error durante el envío del formulario:', error);
                errors.general = error instanceof Error ? error.message : 'Error saving the raffle. Please try again.';
            } finally {
                isSaving.value = false;
            }
        }
    });

    return (
        <>
            <p class="mb-4 text-amber-600">To create a complete raffle you need to log in</p>

            {!isIndexedDBAvailable.value && (
                <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-red-700 dark:text-red-400">
                        Your browser does not support IndexedDB. You will not be able to save raffles as a guest. Please update your browser or register to use all features.
                    </p>
                </div>
            )}

            {successMessage.value && (
                <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <p class="text-green-700 dark:text-green-400">{successMessage.value}</p>
                </div>
            )}

            <Form onSubmit$={handleSubmit} class="space-y-6">
                {/* Raffle name */}
                <div>
                    <label for="raffle-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Raffle name <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="raffle-name"
                        type="text"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                        value={formData.name}
                        onInput$={(e) => formData.name = (e.target as HTMLInputElement).value}
                        maxLength={100}
                        required
                    />
                    {errors.name && <p class="mt-1 text-sm text-red-600 dark:text-red-500">{errors.name}</p>}
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{formData.name.length}/100 characters</p>
                </div>

                {/* Description */}
                <div>
                    <label for="raffle-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description/Note (optional)
                    </label>
                    <textarea
                        id="raffle-description"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                        rows={3}
                        value={formData.description}
                        onInput$={(e) => formData.description = (e.target as HTMLTextAreaElement).value}
                        maxLength={500}
                    ></textarea>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{formData.description.length}/500 characters</p>
                </div>

                {/* Row for Number of tickets and Price */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Number of tickets */}
                    <div>
                        <label for="ticket-count" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Number of tickets <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="ticket-count"
                            type="number"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                            value={formData.ticketCount}
                            onInput$={(e) => formData.ticketCount = parseInt((e.target as HTMLInputElement).value) || 0}
                            min={1}
                            max={100}
                            required
                        />
                        {errors.ticketCount && <p class="mt-1 text-sm text-red-600 dark:text-red-500">{errors.ticketCount}</p>}
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Maximum of 100 tickets as a guest</p>
                    </div>

                    {/* Ticket price */}
                    <div>
                        <label for="ticket-price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Ticket price <span class="text-red-500">*</span>
                        </label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                            </div>
                            <input
                                id="ticket-price"
                                type="number"
                                class="pl-7 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                value={formData.ticketPrice}
                                onInput$={(e) => formData.ticketPrice = parseFloat((e.target as HTMLInputElement).value) || 0}
                                min={0.01}
                                max={1000000}
                                step={0.01}
                                required
                            />
                        </div>
                        {errors.ticketPrice && <p class="mt-1 text-sm text-red-600 dark:text-red-500">{errors.ticketPrice}</p>}
                    </div>
                </div>

                {/* List of prizes */}
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Prizes <span class="text-red-500">*</span>
                        </label>
                        {formData.prizes.length < 10 && (
                            <button
                                type="button"
                                onClick$={addPrize}
                                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                <LuPlus class="mr-1" /> Add Prize
                            </button>
                        )}
                    </div>

                    <div class="space-y-3">
                        {formData.prizes.map((prize, index) => (
                            <div key={`prize-${index}`} class="flex items-start space-x-2">
                                <div class="flex-grow">
                                    <input
                                        type="text"
                                        class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                        value={prize.name}
                                        onInput$={(e) => formData.prizes[index].name = (e.target as HTMLInputElement).value}
                                        placeholder={`Prize name ${index + 1}`}
                                        maxLength={100}
                                        required
                                    />
                                    {prize.error && <p class="mt-1 text-sm text-red-600 dark:text-red-500">{prize.error}</p>}
                                </div>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick$={() => removePrize(index)}
                                        class="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-1"
                                        aria-label="Delete prize"
                                    >
                                        <LuTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">You can add up to 10 prizes</p>
                </div>

                {/* General error message */}
                {errors.general && (
                    <div class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                        <p class="text-sm text-red-700 dark:text-red-400">{errors.general}</p>
                    </div>
                )}

                {/* Submit button */}
                <div class="flex justify-end">
                    <button
                        type="submit"
                        class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving.value || !isIndexedDBAvailable.value}
                    >
                        {isSaving.value ? (
                            <>
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : "Create Raffle"}
                    </button>
                </div>
            </Form>
        </>
    );
});
