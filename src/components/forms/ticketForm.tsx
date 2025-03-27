import { type QRL, $, component$, useSignal, useStylesScoped$ } from '@builder.io/qwik';
import { useForm, valiForm$ } from '@modular-forms/qwik';
import { Button, Input, Label } from '~/components/ui';
import { type TicketForm, type TicketResponseData, TicketSchema } from '~/schemas/ticketSchema';
import { useFormTicketAction } from '~/shared/forms/actions';
import styles from '~/routes/raffle/[uuid]/raffle.css?inline'

export interface TicketFormProps {
    raffleId: number;
    ticketNumber: number;
    initialBuyerName: string | null;
    initialStatus: "unsold" | "sold-unpaid" | "sold-paid";
    onSuccess$?: QRL<() => void>;
    onCancel$?: QRL<() => void>;
}

export default component$<TicketFormProps>(({
    raffleId,
    ticketNumber,
    initialBuyerName,
    initialStatus,
    onSuccess$,
    onCancel$
}) => {
    useStylesScoped$(styles);
    const [ticketForm, { Form, Field }] = useForm<TicketForm, TicketResponseData>({
        loader: {
            value: {
                raffleId,
                number: ticketNumber,
                buyerName: initialBuyerName || '',
                status: initialStatus
            }
        },
        action: useFormTicketAction(),
        validate: valiForm$(TicketSchema),
    });

    const isUpdating = useSignal(false);

    // Handle successful response
    if (ticketForm.response.status === 'success' && !isUpdating.value) {
        isUpdating.value = true;
        if (onSuccess$) {
            onSuccess$();
        }
    }

    const handleSubmit = $((values: TicketForm) => {
        console.log('Submitting ticket values:', values);
        // El formulario se enviará automáticamente al action
    });

    return (
        <Form onSubmit$={handleSubmit} class="space-y-5">
            {/* Hidden field for raffle ID */}
            <Field name="raffleId" type="number">
                {(field, props) => (
                    <input
                        {...props}
                        type="hidden"
                        value={field.value}
                    />
                )}
            </Field>

            {/* Hidden field for number */}
            <Field name="number" type="number">
                {(field, props) => (
                    <input
                        {...props}
                        type="hidden"
                        value={field.value}
                    />
                )}
            </Field>

            <Field name="buyerName">
                {(field, props) => (
                    <>
                        <Label for="buyerName" class="modal-label">Buyer Name</Label>
                        <Input
                            {...props}
                            id="buyerName"
                            type="text"
                            value={field.value}
                            placeholder="Buyer Name"
                            class="w-full modal-input"
                            disabled={ticketForm.submitting || field.value === "unsold"}
                        />
                        {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                    </>
                )}
            </Field>

            <Field name="status">
                {(field, props) => (
                    <>
                        <Label class="modal-label">Ticket Status</Label>
                        <div class="ticket-status-radio">
                            <div
                                class={`ticket-status-option unsold ${field.value === "unsold" ? "selected" : ""}`}
                                onClick$={() => field.value = "unsold"}
                            >
                                <input
                                    {...props}
                                    type="radio"
                                    id="status-unsold"
                                    value="unsold"
                                    checked={field.value === "unsold"}
                                    class="h-4 w-4 accent-purple-600"
                                />
                                <label for="status-unsold" class="flex-1 cursor-pointer">Unsold</label>
                            </div>

                            <div
                                class={`ticket-status-option unpaid ${field.value === "sold-unpaid" ? "selected" : ""}`}
                                onClick$={() => field.value = "sold-unpaid"}
                            >
                                <input
                                    {...props}
                                    type="radio"
                                    id="status-unpaid"
                                    value="sold-unpaid"
                                    checked={field.value === "sold-unpaid"}
                                    class="h-4 w-4 accent-purple-600"
                                />
                                <label for="status-unpaid" class="flex-1 cursor-pointer">Sold - Unpaid</label>
                            </div>

                            <div
                                class={`ticket-status-option paid ${field.value === "sold-paid" ? "selected" : ""}`}
                                onClick$={() => field.value = "sold-paid"}
                            >
                                <input
                                    {...props}
                                    type="radio"
                                    id="status-paid"
                                    value="sold-paid"
                                    checked={field.value === "sold-paid"}
                                    class="h-4 w-4 accent-purple-600"
                                />
                                <label for="status-paid" class="flex-1 cursor-pointer">Sold - Paid</label>
                            </div>
                        </div>
                    </>
                )}
            </Field>

            <footer class="modal-footer">
                <Button
                    look="secondary"
                    type="button"
                    onClick$={onCancel$}
                    class="px-4 py-2 text-purple-800 bg-white border-purple-200 hover:bg-purple-50"
                >
                    Cancel
                </Button>
                <Button
                    look="primary"
                    type="submit"
                    disabled={ticketForm.submitting}
                    class="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white"
                >
                    {ticketForm.submitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </footer>
        </Form>
    );
});