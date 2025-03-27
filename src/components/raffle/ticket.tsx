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
                class={`ticket ${ticket.status === 'unsold'
                    ? 'ticket-unsold'
                    : ticket.status === 'sold-unpaid'
                        ? 'ticket-unpaid'
                        : 'ticket-paid'
                    }`}
            >
                <span class="text-sm sm:text-lg font-semibold">{ticket.number}</span>
                {ticket.buyerName && (
                    <span class="buyer-name">
                        {ticket.buyerName}
                    </span>
                )}
            </div>

            {/* Modal to edit ticket */}
            <Modal.Root bind:show={showModal}>
                <Modal.Panel class="modal-edit-ticket">
                    <Modal.Close
                        class="absolute right-4 top-4 text-purple-700 hover:text-purple-900 transition-colors"
                        onClick$={handleClose}
                    >
                        <LuX class="h-5 w-5" />
                    </Modal.Close>
                    <div class="pb-2">
                        <Modal.Title class="text-xl font-bold text-purple-800">
                            Edit Ticket Number {ticket.number}
                        </Modal.Title>
                        <Modal.Description class="text-purple-600">
                            Update information of the selected ticket
                        </Modal.Description>
                    </div>
                    <TicketForm 
                        raffleId={raffleId}
                        ticketNumber={ticket.number}
                        initialBuyerName={ticket.buyerName}
                        initialStatus={ticket.status}
                        onSuccess$={handleSuccess}
                        onCancel$={handleCancel}
                    />
                </Modal.Panel>
            </Modal.Root>
        </>
    );
}); 