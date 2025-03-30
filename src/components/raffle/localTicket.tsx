import { type QRL, component$, useSignal, $, useStylesScoped$ } from '@builder.io/qwik';
import { Modal } from '~/components/ui';
import { LuX } from '@qwikest/icons/lucide';
import styles from '~/routes/raffle/[uuid]/raffle.css?inline';
import type { Ticket } from '~/shared/indexedDB/config';
import LocalTicketForm from '~/components/forms/localTicketForm';

interface LocalTicketProps {
    ticket: Ticket;
    raffleId: number;
    onUpdate$?: QRL<() => void>;
}

export default component$<LocalTicketProps>(({ ticket, raffleId, onUpdate$ }) => {
    useStylesScoped$(styles);
    
    const showModal = useSignal(false);

    const handleTicketClick = $(() => {
        showModal.value = true;
    });

    const handleSuccess = $(() => {
        showModal.value = false;
        if (onUpdate$) {
            onUpdate$();
        }
    });

    const handleCancel = $(() => {
        showModal.value = false;
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

                        <LocalTicketForm
                            raffleId={raffleId}
                            ticketNumber={ticket.number}
                            initialBuyerName={ticket.buyerName}
                            initialBuyerPhone={ticket.buyerPhone}
                            initialNotes={ticket.notes}
                            initialStatus={ticket.status}
                            onSuccess$={handleSuccess}
                            onCancel$={handleCancel}
                        />
                    </Modal.Panel>
                </Modal.Root>
            </div>
        </>
    );
});