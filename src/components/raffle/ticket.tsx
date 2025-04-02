import { component$, useSignal, $, useStylesScoped$ } from '@builder.io/qwik';
import type { Ticket } from '~/routes/raffle/[uuid]';
import { Modal } from '~/components/ui';
import { LuX } from '@qwikest/icons/lucide';
import TicketForm from "~/components/forms/ticketForm";
import styles from '~/routes/raffle/[uuid]/raffle.css?inline';

interface TicketProps {
    ticket: Ticket;
    raffleId: number;
}

export default component$<TicketProps>(({ ticket, raffleId }) => {
    useStylesScoped$(styles);
    
    const showModal = useSignal(false);

    const handleTicketClick = $(() => {
        showModal.value = true;
    });

    const handleSuccess = $(() => {
        showModal.value = false;
    });

    const handleCancel = $(() => {
        showModal.value = false;
    });

    const handleClose = $(() => {
        showModal.value = false;
    });

    return (
        <>
            <div
                key={ticket.number}
                onClick$={handleTicketClick}
                class={`p-4 ticket ${ticket.status === 'unsold'
                    ? 'unsold'
                    : ticket.status === 'sold-unpaid'
                        ? 'pending'
                        : 'paid'
                    }`}
                title={ticket.buyerName || ''}
            >
                <div class="ticket-number">{ticket.number}</div>
                {ticket.buyerName && (
                    <div class="ticket-info">
                        <span class="buyer-name" title={ticket.buyerName}>
                            {ticket.buyerName}
                        </span>
                    </div>
                )}
                {ticket.buyerName && (
                    <div class="hover-info">
                        {`${ticket.buyerName} ${ticket.buyerPhone ? '(' + ticket.buyerPhone + ')': ''}`}
                    </div>
                )}
                <Modal.Root bind:show={showModal}>
                    <Modal.Panel class="modal-edit-ticket">
                        <Modal.Close
                            class="absolute right-4 top-4 text-purple-700 hover:text-purple-900 transition-colors"
                            onClick$={handleClose}
                        >
                            <LuX class="h-5 w-5" />
                        </Modal.Close>
                        <TicketForm 
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