import { type QRL, component$, useSignal, $, useStylesScoped$ } from '@builder.io/qwik';
import { toast } from 'qwik-sonner';
import { openDB } from '~/shared/indexedDB/config';
import styles from './ticketForm.css?inline';
import { LuUser, LuPhone, LuTicket, LuCheckCircle, LuClock, LuStickyNote } from '@qwikest/icons/lucide';
import { Textarea } from '~/components/ui';
import { _ } from "compiled-i18n";

export interface LocalTicketFormProps {
    raffleId: number;
    ticketNumber: number;
    initialBuyerName: string | null;
    initialBuyerPhone: string | null;
    initialNotes: string | null;
    initialStatus: "unsold" | "sold-unpaid" | "sold-paid";
    onSuccess$?: QRL<() => void>;
    onCancel$?: QRL<() => void>;
}

export default component$<LocalTicketFormProps>(
    ({ raffleId, ticketNumber, initialBuyerName, initialBuyerPhone, initialNotes, initialStatus, onSuccess$, onCancel$ }) => {
        useStylesScoped$(styles);
        
        const buyerName = useSignal(initialBuyerName || "");
        const buyerPhone = useSignal(initialBuyerPhone || "");
        const notes = useSignal(initialNotes || "");
        const status = useSignal<"unsold" | "sold-unpaid" | "sold-paid">(initialStatus);
        const isSaving = useSignal(false);

        const cancelSale = $(async () => {
            try {
                isSaving.value = true;
                const db = await openDB();
                const transaction = db.transaction(['tickets'], 'readwrite');
                const store = transaction.objectStore('tickets');
                const index = store.index('raffleId_number');
                const keyRange = IDBKeyRange.only([raffleId, ticketNumber]);
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
                if (onSuccess$) {
                    onSuccess$();
                }
            } catch (error) {
                console.error('Error canceling sale:', error);
                toast.error("Error canceling sale");
            } finally {
                isSaving.value = false;
            }
        });

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
                const keyRange = IDBKeyRange.only([raffleId, ticketNumber]);
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
                if (onSuccess$) {
                    onSuccess$();
                }
            } catch (error) {
                console.error('Error updating ticket:', error);
                toast.error("Error updating ticket");
            } finally {
                isSaving.value = false;
            }
        });

        return (
            <div class="form-container">
                <div class="space-y-5">
                    {/* Buyer Name Field */}
                    <div class="form-field">
                        <label for="buyerName" class="field-label">
                            {_`Buyer Name`}
                        </label>
                        <div class="input-with-icon">
                            <LuUser class="input-icon h-5 w-5" />
                            <input
                                id="buyerName"
                                type="text"
                                value={buyerName.value}
                                onInput$={(e) => buyerName.value = (e.target as HTMLInputElement).value}
                                class="input-field"
                                placeholder={_`Enter buyer's name`}
                                disabled={isSaving.value}
                            />
                        </div>
                    </div>

                    {/* Phone Number Field */}
                    <div class="form-field">
                        <label for="buyerPhone" class="field-label">
                            {_`Phone Number (optional)`}
                        </label>
                        <div class="input-with-icon">
                            <LuPhone class="input-icon h-5 w-5" />
                            <input
                                id="buyerPhone"
                                type="text"
                                value={buyerPhone.value}
                                onInput$={(e) => buyerPhone.value = (e.target as HTMLInputElement).value}
                                class="input-field"
                                placeholder={_`Enter phone number`}
                                disabled={isSaving.value}
                            />
                        </div>
                    </div>

                    {/* Notes Field */}
                    <div class="form-field">
                        <label for="notes" class="field-label">
                            {_`Notes (optional)`}
                        </label>
                        <div class="input-with-icon">
                            <LuStickyNote class="input-icon h-5 w-5" />
                            <Textarea
                                id="notes"
                                value={notes.value}
                                onInput$={(e) => notes.value = (e.target as HTMLTextAreaElement).value}
                                class="input-field"
                                placeholder={_`Add any notes`}
                                rows={3}
                                disabled={isSaving.value}
                            />
                        </div>
                    </div>

                    {/* Ticket Status Field */}
                    <div class="form-field">
                        <label class="field-label">
                            <div class="flex items-center">
                                <LuTicket class="h-5 w-5 mr-2" />
                                {_`Ticket Status`}
                            </div>
                        </label>
                        <div class="status-options">
                            <div
                                class={`status-option paid ${status.value === "sold-paid" ? "selected" : ""}`}
                                onClick$={() => status.value = "sold-paid"}
                            >
                                <input
                                    type="radio"
                                    id="status-paid"
                                    value="sold-paid"
                                    checked={status.value === "sold-paid"}
                                    class="status-radio accent-green-600"
                                    disabled={isSaving.value}
                                />
                                <label for="status-paid" class="status-label">
                                    {_`Sold - Paid`}
                                </label>
                                <LuCheckCircle class="status-icon h-5 w-5 text-green-600" />
                            </div>

                            <div
                                class={`status-option unpaid ${status.value === "sold-unpaid" ? "selected" : ""}`}
                                onClick$={() => status.value = "sold-unpaid"}
                            >
                                <input
                                    type="radio"
                                    id="status-unpaid"
                                    value="sold-unpaid"
                                    checked={status.value === "sold-unpaid"}
                                    class="status-radio accent-amber-600"
                                    disabled={isSaving.value}
                                />
                                <label for="status-unpaid" class="status-label">
                                    {_`Sold - Unpaid`}
                                </label>
                                <LuClock class="status-icon h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                    </div>

                    {/* Form Footer */}
                    <div class="form-footer">
                        {initialStatus !== "unsold" && (
                            <button
                                type="button"
                                onClick$={cancelSale}
                                class="cancel-btn"
                                disabled={isSaving.value}
                            >
                                {_`Cancel Sale`}
                            </button>
                        )}
                        <div class="flex-1"></div>
                        <button
                            type="button"
                            onClick$={onCancel$}
                            class="cancel-btn"
                            disabled={isSaving.value}
                        >
                            {_`Cancel`}
                        </button>
                        <button
                            type="button"
                            onClick$={updateTicket}
                            class="submit-btn"
                            disabled={isSaving.value}
                        >
                            {isSaving.value ? _`Saving...` : _`Save Changes`}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);
