import { type QRL, $, component$, useSignal, useStylesScoped$ } from "@builder.io/qwik"
import { useForm, valiForm$ } from "@modular-forms/qwik"
import { Input, Label } from "~/components/ui"
import { type TicketForm, type TicketResponseData, TicketSchema } from "~/schemas/ticketSchema"
import { useFormTicketAction } from "~/shared/forms/actions"
import { LuUser, LuTicket, LuAlertCircle, LuCheckCircle, LuClock } from "@qwikest/icons/lucide";
import styles from './ticketForm.css?inline';
import { toast } from "qwik-sonner"

export interface TicketFormProps {
    raffleId: number
    ticketNumber: number
    initialBuyerName: string | null
    initialStatus: "unsold" | "sold-unpaid" | "sold-paid"
    onSuccess$?: QRL<() => void>
    onCancel$?: QRL<() => void>
}

export default component$<TicketFormProps>(
    ({ raffleId, ticketNumber, initialBuyerName, initialStatus, onSuccess$, onCancel$ }) => {
        useStylesScoped$(styles);

        const [ticketForm, { Form, Field }] = useForm<TicketForm, TicketResponseData>({
            loader: {
                value: {
                    raffleId,
                    number: ticketNumber,
                    buyerName: initialBuyerName || "",
                    status: initialStatus === "unsold" ? "sold-paid" : initialStatus,
                },
            },
            action: useFormTicketAction(),
            validate: valiForm$(TicketSchema),
        })

        const isUpdating = useSignal(false)

        // Handle successful response
        if (ticketForm.response.status === "success" && !isUpdating.value) {
            toast.success("Ticket updated successfully!");
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
                <Form onSubmit$={handleSubmit} class="space-y-5">
                    {/* Hidden fields */}
                    <Field name="raffleId" type="number">
                        {(field, props) => <input {...props} type="hidden" value={field.value} />}
                    </Field>

                    <Field name="number" type="number">
                        {(field, props) => <input {...props} type="hidden" value={field.value} />}
                    </Field>

                    {/* Buyer Name Field */}
                    <div class="form-field">
                        <Field name="buyerName">
                            {(field, props) => (
                                <>
                                    <Label for="buyerName" class="field-label">
                                        Buyer Name
                                    </Label>
                                    <div class="input-with-icon">
                                        <LuUser class="input-icon h-5 w-5" />
                                        <Input
                                            {...props}
                                            id="buyerName"
                                            type="text"
                                            value={field.value}
                                            placeholder="Enter buyer's name"
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

                    {/* Ticket Status Field */}
                    <div class="form-field">
                        <Field name="status">
                            {(field, props) => (
                                <>
                                    <Label class="field-label">
                                        <div class="flex items-center">
                                            <LuTicket class="h-5 w-5 mr-2" />
                                            Ticket Status
                                        </div>
                                    </Label>
                                    <div class="status-options">
                                        <div
                                            class={`status-option paid ${field.value === "sold-paid" ? "selected" : ""}`}
                                            onClick$={() => (field.value = "sold-paid")}
                                        >
                                            <input
                                                {...props}
                                                type="radio"
                                                id="status-paid"
                                                value="sold-paid"
                                                checked={field.value === "sold-paid"}
                                                class="status-radio accent-green-600"
                                            />
                                            <label for="status-paid" class="status-label">
                                                Sold - Paid
                                            </label>
                                            <LuCheckCircle class="status-icon h-5 w-5 text-green-600" />
                                        </div>

                                        <div
                                            class={`status-option unpaid ${field.value === "sold-unpaid" ? "selected" : ""}`}
                                            onClick$={() => (field.value = "sold-unpaid")}
                                        >
                                            <input
                                                {...props}
                                                type="radio"
                                                id="status-unpaid"
                                                value="sold-unpaid"
                                                checked={field.value === "sold-unpaid"}
                                                class="status-radio accent-amber-600"
                                            />
                                            <label for="status-unpaid" class="status-label">
                                                Sold - Unpaid
                                            </label>
                                            <LuClock class="status-icon h-5 w-5 text-amber-600" />
                                        </div>
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

                    {/* Form Footer */}
                    <div class="form-footer">
                        <button 
                            type="button" 
                            onClick$={onCancel$} 
                            class="cancel-btn" 
                            disabled={ticketForm.submitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={ticketForm.submitting} 
                            class="submit-btn"
                        >
                            {ticketForm.submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </Form>
            </div>
        )
    },
)

