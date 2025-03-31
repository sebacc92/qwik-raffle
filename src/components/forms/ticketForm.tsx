import { type QRL, $, component$, useSignal, useStylesScoped$ } from "@builder.io/qwik"
import { useForm, valiForm$ } from "@modular-forms/qwik"
import { Input, Label, Textarea } from "~/components/ui"
import { type TicketForm, type TicketResponseData, TicketSchema } from "~/schemas/ticketSchema"
import { useFormTicketAction } from "~/shared/forms/actions"
import { LuUser, LuPhone, LuTicket, LuAlertCircle, LuCheckCircle, LuClock, LuStickyNote } from "@qwikest/icons/lucide";
import styles from './ticketForm.css?inline';
import { toast } from "qwik-sonner"
import { _ } from "compiled-i18n"

export interface TicketFormProps {
    raffleId: number
    ticketNumber: number
    initialBuyerName: string | null
    initialBuyerPhone?: string | null
    initialNotes?: string | null
    initialStatus: "unsold" | "sold-unpaid" | "sold-paid"
    onSuccess$?: QRL<() => void>
    onCancel$?: QRL<() => void>
}

export default component$<TicketFormProps>(
    ({ raffleId, ticketNumber, initialBuyerName, initialBuyerPhone, initialNotes, initialStatus, onSuccess$, onCancel$ }) => {
        useStylesScoped$(styles);

        const [ticketForm, { Form, Field }] = useForm<TicketForm, TicketResponseData>({
            loader: {
                value: {
                    raffleId,
                    number: ticketNumber,
                    buyerName: initialBuyerName || "",
                    buyerPhone: initialBuyerPhone || "",
                    notes: initialNotes || "",
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
                                        {_`Buyer Name`}
                                    </Label>
                                    <div class="input-with-icon">
                                        <LuUser class="input-icon h-5 w-5" />
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
                                    <Label for="buyerPhone" class="field-label">
                                        {_`Phone Number (optional)`}
                                    </Label>
                                    <div class="input-with-icon">
                                        <LuPhone class="input-icon h-5 w-5" />
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
                                    <Label for="notes" class="field-label">
                                        {_`Notes (optional)`}
                                    </Label>
                                    <div class="input-with-icon">
                                        <LuStickyNote class="input-icon h-5 w-5" />
                                        <Textarea
                                            {...props}
                                            id="notes"
                                            value={field.value}
                                            placeholder={_`Add any notes`}
                                            class="input-field"
                                            rows={3}
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
                                            {_`Ticket Status`}
                                        </div>
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
                        <button
                            type="button"
                            onClick$={onCancel$}
                            class="cancel-btn"
                            disabled={ticketForm.submitting}
                        >
                            {_`Cancel`}
                        </button>
                        <button
                            type="submit"
                            class="submit-btn"
                            disabled={ticketForm.submitting}
                        >
                            {ticketForm.submitting ? _`Saving...` : _`Save Changes`}
                        </button>
                    </div>
                </Form>
            </div>
        )
    },
)

