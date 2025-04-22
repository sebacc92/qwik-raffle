import { type QRL, $, component$, useSignal, useStylesScoped$ } from "@builder.io/qwik"
import { useForm, valiForm$, FieldArray } from "@modular-forms/qwik"
import { Button, Input, Label, Textarea } from "~/components/ui"
import { type TicketForm, type TicketResponseData, TicketSchema } from "~/schemas/ticketSchema"
import { useFormTicketAction } from "~/shared/forms/actions"
import { LuUser, LuPhone, LuTicket, LuAlertCircle, LuCheckCircle, LuClock, LuStickyNote } from "@qwikest/icons/lucide";
import styles from './ticketForm.css?inline';
import { toast } from "qwik-sonner"
import { _ } from "compiled-i18n"

export interface TicketFormProps {
    raffleId: number;
    ticketNumber?: number; // Make optional
    selectedTickets?: number[]; // Add optional array
    initialBuyerName: string | null;
    initialBuyerPhone?: string | null;
    initialNotes?: string | null;
    initialStatus: "unsold" | "sold-unpaid" | "sold-paid";
    onSuccess$?: QRL<() => void>;
    onCancel$?: QRL<() => void>;
}


export default component$<TicketFormProps>(
    ({ raffleId, ticketNumber, selectedTickets, initialBuyerName, initialBuyerPhone, initialNotes, initialStatus, onSuccess$, onCancel$ }) => {
        useStylesScoped$(styles);

        const isMultiEdit = selectedTickets && selectedTickets.length > 0;

        const [ticketForm, { Form, Field, FieldArray }] = useForm<TicketForm, TicketResponseData>({
            loader: {
                value: {
                    raffleId,
                    // Set number or numbers based on props
                    number: !isMultiEdit ? ticketNumber : undefined,
                    numbers: isMultiEdit ? selectedTickets : [],
                    buyerName: initialBuyerName || "",
                    buyerPhone: initialBuyerPhone || "",
                    notes: initialNotes || "",
                    // For multi-edit, default to a specific status, e.g., sold-paid, or keep existing logic
                    status: isMultiEdit ? "sold-paid" : (initialStatus === "unsold" ? "sold-paid" : initialStatus),
                },
            },
            action: useFormTicketAction(),
            validate: valiForm$(TicketSchema),
            fieldArrays: isMultiEdit ? ['numbers'] : undefined,
        })
        console.log('ticketForm', ticketForm)

        const isUpdating = useSignal(false)

        // Handle successful response
        // Check for the response structure we defined earlier
        if (ticketForm.response.status === "success" && ticketForm.response.data?.success && !isUpdating.value) {
            const count = ticketForm.response.data.data?.updated_count || 1;
            const message = count > 1 ? _`Tickets updated successfully!` : _`Ticket updated successfully!` ;
            toast.success(message);
            isUpdating.value = true
            if (onSuccess$) {
                onSuccess$()
            }
        }

        const handleSubmit = $((values: TicketForm) => {
            console.log("Submitting ticket values:", values)
            // Form will be automatically submitted to the action
        })

        return (
            <div class="form-container">
                {/* Conditional Title */}
                <h2 class="text-3xl text-center font-medium">
                    {isMultiEdit
                        ? _`Editar ${selectedTickets?.length ?? 0} Tickets Seleccionados`
                        : <>{_`Edit Ticket #`}{ticketNumber && <span class="font-bold">{ticketNumber}</span>}</>
                    }
                </h2>
                <p class="text-lg text-gray-500 text-center">
                    {isMultiEdit
                        ? _`Asignar información a los tickets seleccionados`
                        : _`Update ticket information`
                    }
                </p>
                
                <Form onSubmit$={handleSubmit} class="space-y-5">
                    {/* Hidden fields */}
                    <Field name="raffleId" type="number">
                        {(field, props) => <input {...props} type="hidden" value={field.value} />}
                    </Field>

                    {/* Conditionally render hidden field for number or numbers */}
                    {/* Modular forms handles array fields directly, just need the Field component */}
                    {!isMultiEdit && (
                        <Field name="number" type="number">
                            {(field, props) => <input {...props} type="hidden" value={field.value} />}
                        </Field>
                    )}
                    {/* For multi-edit, render hidden inputs directly without Field wrapper */}
                    {isMultiEdit && (
                        <FieldArray name="numbers">
                            {(fieldArray) => (
                                <>
                                    {fieldArray.items.map((item, index) => (
                                        <Field key={item} name={`numbers.${index}`} type="number">
                                            {(field, props) => (
                                                <input {...props} type="hidden" value={field.value} />
                                            )}
                                        </Field>
                                    ))}
                                </>
                            )}
                        </FieldArray>
                    )}

                    {/* Buyer Name Field */}
                    <div class="form-field">
                        <Field name="buyerName">
                            {(field, props) => (
                                <>
                                    <Label for="buyerName" class="flex items-center">
                                        <LuUser class="text-primary h-5 w-5 mr-1" />
                                        <span>{_`Buyer Name`}</span>
                                    </Label>
                                    <div class="input-with-icon mt-1">
                                        <Input
                                            {...props}
                                            autofocus
                                            id="buyerName"
                                            type="text"
                                            value={field.value}
                                            placeholder={_`Enter buyer's name`}
                                            class="input-field"
                                            disabled={ticketForm.submitting}
                                        />
                                    </div>
                                    {field.error && (
                                        <div class="error-message">
                                            <LuAlertCircle class="h-4 w-4 mr-1" />
                                            {field.error}
                                        </div>
                                    )}
                                </>
                            )}
                        </Field>
                    </div>

                    {/* Phone Number Field */}
                    <div class="form-field">
                        <Field name="buyerPhone">
                            {(field, props) => (
                                <>
                                    <Label for="buyerPhone" class="flex items-center">
                                        <LuPhone class="text-primary h-5 w-5 mr-1" />
                                        <span>{_`Phone Number (optional)`}</span>
                                    </Label>
                                    <div class="input-with-icon mt-1">
                                        <Input
                                            {...props}
                                            id="buyerPhone"
                                            type="text"
                                            value={field.value}
                                            placeholder={_`Enter phone number`}
                                            class="input-field"
                                            disabled={ticketForm.submitting}
                                        />
                                    </div>
                                    {field.error && (
                                        <div class="error-message">
                                            <LuAlertCircle class="h-4 w-4 mr-1" />
                                            {field.error}
                                        </div>
                                    )}
                                </>
                            )}
                        </Field>
                    </div>

                    {/* Notes Field */}
                    <div class="form-field">
                        <Field name="notes">
                            {(field, props) => (
                                <>
                                    <Label for="notes" class="flex items-center mb-1">
                                        <LuStickyNote class="text-primary h-5 w-5 mr-1" />
                                        <span>{_`Notes (optional)`}</span>
                                    </Label>
                                    <Textarea
                                        {...props}
                                        id="notes"
                                        value={field.value}
                                        placeholder={_`Add any notes about this ticket or buyer`}
                                        class="input-field textarea-field"
                                        rows={3}
                                        disabled={ticketForm.submitting}
                                    />
                                    {field.error && (
                                        <div class="error-message">
                                            <LuAlertCircle class="h-4 w-4 mr-1" />
                                            {field.error}
                                        </div>
                                    )}
                                </>
                            )}
                        </Field>
                    </div>

                    {/* Ticket Status Field */}
                    <div class="form-field status-field">
                        <Field name="status">
                            {(field, props) => (
                                <>
                                    <Label class="flex items-center">
                                        <LuTicket class="text-primary h-5 w-5 mr-1" />
                                        <span>{_`Ticket Status`}</span>
                                    </Label>
                                    <div class="status-options">
                                        <div
                                            class={`status-option paid ${
                                                field.value === "sold-paid" ? "selected" : ""
                                            }`}
                                            onClick$={() => {
                                                field.value = "sold-paid"
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                id="status-paid"
                                                {...props}
                                                value="sold-paid"
                                                checked={field.value === "sold-paid"}
                                                class="status-radio accent-green-600"
                                                disabled={ticketForm.submitting}
                                            />
                                            <label for="status-paid" class="status-label">
                                                {_`Sold - Paid`}
                                            </label>
                                            <LuCheckCircle class="status-icon h-5 w-5 text-green-600" />
                                        </div>

                                        <div
                                            class={`status-option unpaid ${
                                                field.value === "sold-unpaid" ? "selected" : ""
                                            }`}
                                            onClick$={() => {
                                                field.value = "sold-unpaid"
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                id="status-unpaid"
                                                {...props}
                                                value="sold-unpaid"
                                                checked={field.value === "sold-unpaid"}
                                                class="status-radio accent-amber-600"
                                                disabled={ticketForm.submitting}
                                            />
                                            <label for="status-unpaid" class="status-label">
                                                {_`Sold - Unpaid`}
                                            </label>
                                            <LuClock class="status-icon h-5 w-5 text-amber-600" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </Field>
                    </div>

                    {/* Form Footer */}
                    <div class="form-footer">
                        <Button
                            look="cancel"
                            // Use onCancel$ prop for cancellation
                            onClick$={onCancel$}
                            disabled={ticketForm.submitting}
                        >
                            {_`Cancel`}
                        </Button>
                        <Button
                            look="success"
                            type="submit"
                            disabled={ticketForm.submitting}
                        >
                            {ticketForm.submitting ? _`Saving...` : _`Save Changes`}
                        </Button>
                    </div>
                </Form>
            </div>
        )
    },
)
