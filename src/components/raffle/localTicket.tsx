import { type QRL, component$, useSignal, $, useStylesScoped$ } from '@builder.io/qwik';
import { Modal } from '~/components/ui';
import { LuX } from '@qwikest/icons/lucide';
import { toast } from 'qwik-sonner';
import styles from '~/routes/raffle/[uuid]/raffle.css?inline';
import type { Ticket } from '~/shared/indexedDB/config';
import { openDB } from '~/shared/indexedDB/config';

interface LocalTicketProps {
    ticket: Ticket;
    raffleId: number;
    onUpdate$?: QRL<() => void>;
}

export default component$<LocalTicketProps>(({ ticket, raffleId, onUpdate$ }) => {
    useStylesScoped$(styles);
    
    const showModal = useSignal(false);
    const isEditing = useSignal(false);
    const buyerName = useSignal(ticket.buyerName || "");
    const buyerPhone = useSignal(ticket.buyerPhone || "");
    const notes = useSignal(ticket.notes || "");
    const status = useSignal<"unsold" | "sold-unpaid" | "sold-paid">(ticket.status);
    const isSaving = useSignal(false);

    // Función para actualizar el ticket en IndexedDB
    const updateTicket = $(async () => {
        if (!buyerName.value.trim() && status.value !== "unsold") {
            toast.error("Buyer name is required");
            return;
        }

        try {
            isSaving.value = true;
            const db = await openDB();
            const transaction = db.transaction(['tickets'], 'readwrite');
            const store = transaction.objectStore('tickets');
            const index = store.index('raffleId_number');
            const keyRange = IDBKeyRange.only([raffleId, ticket.number]);
            const request = index.openCursor(keyRange);

            await new Promise<void>((resolve, reject) => {
                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result;
                    if (cursor) {
                        const updatedTicket = {
                            ...cursor.value,
                            buyerName: buyerName.value.trim() || null,
                            buyerPhone: buyerPhone.value.trim() || null,
                            notes: notes.value.trim() || null,
                            status: buyerName.value.trim() ? status.value : "unsold",
                            updatedAt: new Date().toISOString()
                        };
                        cursor.update(updatedTicket);
                    }
                };

                transaction.oncomplete = () => {
                    db.close();
                    resolve();
                };

                transaction.onerror = () => {
                    reject(new Error('Error updating ticket'));
                };
            });

            toast.success("Ticket updated successfully");
            showModal.value = false;
            if (onUpdate$) {
                onUpdate$();
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
            toast.error("Error updating ticket");
        } finally {
            isSaving.value = false;
        }
    });

    const handleTicketClick = $(() => {
        showModal.value = true;
        isEditing.value = true;
        buyerName.value = ticket.buyerName || "";
        buyerPhone.value = ticket.buyerPhone || "";
        notes.value = ticket.notes || "";
        status.value = ticket.status;
    });

    const handleCancel = $(() => {
        showModal.value = false;
        isEditing.value = false;
    });

    const cancelSale = $(async () => {
        try {
            isSaving.value = true;
            const db = await openDB();
            const transaction = db.transaction(['tickets'], 'readwrite');
            const store = transaction.objectStore('tickets');
            const index = store.index('raffleId_number');
            const keyRange = IDBKeyRange.only([raffleId, ticket.number]);
            const request = index.openCursor(keyRange);
            
            await new Promise<void>((resolve, reject) => {
                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result;
                    if (cursor) {
                        const updatedTicket = {
                            ...cursor.value,
                            buyerName: null,
                            buyerPhone: null,
                            notes: null,
                            status: "unsold",
                            updatedAt: new Date().toISOString()
                        };
                        cursor.update(updatedTicket);
                    }
                };
                transaction.oncomplete = () => {
                    db.close();
                    resolve();
                };
                transaction.onerror = () => {
                    reject(new Error('Error canceling sale'));
                };
            });
            
            toast.success("Sale cancelled successfully");
            showModal.value = false;
            if (onUpdate$) {
                onUpdate$();
            }
        } catch (error) {
            console.error('Error canceling sale:', error);
            toast.error("Error canceling sale");
        } finally {
            isSaving.value = false;
        }
    });

    return (
        <>
            <div
                class={`p-4 ticket ${
                    ticket.status === 'unsold'
                        ? 'unsold'
                        : ticket.status === 'sold-unpaid'
                            ? 'pending'
                            : 'paid'
                }`}
                onClick$={handleTicketClick}
                title={ticket.buyerName || ''}
            >
                <div class="ticket-number">{ticket.number}</div>
                {ticket.status !== "unsold" && (
                    <div class="ticket-info">
                        <span class="buyer-name" title={ticket.buyerName || ''}>
                            {ticket.buyerName}
                        </span>
                    </div>
                )}
                {ticket.status !== "unsold" && (
                    <div class="hover-info">
                        {`${ticket.buyerName} ${ticket.buyerPhone ? '(' + ticket.buyerPhone + ')': ''}`}
                    </div>
                )}
                <Modal.Root bind:show={showModal}>
                    <Modal.Panel class="modal-edit-ticket">
                        <Modal.Close
                            class="absolute right-4 top-4 text-purple-700 hover:text-purple-900 transition-colors"
                            onClick$={handleCancel}
                        >
                            <LuX class="h-5 w-5" />
                        </Modal.Close>
                        <div class="pb-4">
                            <Modal.Title class="text-xl font-bold text-purple-800">
                                Edit Ticket #{ticket.number}
                            </Modal.Title>
                            <Modal.Description class="text-purple-600">
                                Update ticket information
                            </Modal.Description>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Buyer Name
                                </label>
                                <input
                                    type="text"
                                    value={buyerName.value}
                                    onInput$={(e) => buyerName.value = (e.target as HTMLInputElement).value}
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Enter buyer name"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone Number (optional)
                                </label>
                                <input
                                    type="text"
                                    value={buyerPhone.value}
                                    onInput$={(e) => buyerPhone.value = (e.target as HTMLInputElement).value}
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Notes (optional)
                                </label>
                                <textarea
                                    value={notes.value}
                                    onInput$={(e) => notes.value = (e.target as HTMLTextAreaElement).value}
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Add any notes"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <div class="space-y-2">
                                    <button
                                        onClick$={() => status.value = "sold-paid"}
                                        class={`w-full p-2 rounded-md flex items-center justify-between ${
                                            status.value === "sold-paid"
                                                ? "bg-green-100 border-green-500"
                                                : "bg-gray-50 border-gray-300"
                                        } border`}
                                    >
                                        <span>Paid</span>
                                        {status.value === "sold-paid" && (
                                            <span class="text-green-600">✓</span>
                                        )}
                                    </button>
                                    <button
                                        onClick$={() => status.value = "sold-unpaid"}
                                        class={`w-full p-2 rounded-md flex items-center justify-between ${
                                            status.value === "sold-unpaid"
                                                ? "bg-yellow-100 border-yellow-500"
                                                : "bg-gray-50 border-gray-300"
                                        } border`}
                                    >
                                        <span>Pending Payment</span>
                                        {status.value === "sold-unpaid" && (
                                            <span class="text-yellow-600">⌛</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 flex justify-end space-x-3">
                            {ticket.status !== "unsold" && (
                                <button
                                    onClick$={cancelSale}
                                    class="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    disabled={isSaving.value}
                                >
                                    Cancel Sale
                                </button>
                            )}
                            <button
                                onClick$={handleCancel}
                                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                disabled={isSaving.value}
                            >
                                Cancel
                            </button>
                            <button
                                onClick$={updateTicket}
                                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                disabled={isSaving.value}
                            >
                                {isSaving.value ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </Modal.Panel>
                </Modal.Root>
            </div>

        </>
    );
});