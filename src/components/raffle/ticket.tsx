import { component$, useSignal, $, useStylesScoped$, type PropFunction } from '@builder.io/qwik';
import type { Ticket } from '~/routes/raffle/[uuid]';
import { Modal } from '~/components/ui';
import { LuX } from '@qwikest/icons/lucide';
import TicketForm from "~/components/forms/ticketForm";
import styles from '~/routes/raffle/[uuid]/raffle.css?inline';

interface TicketProps {
    ticket: Ticket;
    raffleId: number;
    isMultiSelectMode?: boolean;
    isSelected?: boolean;
    showBuyerName?: boolean;
    onSelect$?: PropFunction<(payload: { ticketNumber: number; ctrlOrCmd: boolean }) => void>;
}

export default component$<TicketProps>(({ ticket, raffleId, isMultiSelectMode = false, isSelected = false, showBuyerName = false, onSelect$ }) => {
    useStylesScoped$(styles);
    
    const showModal = useSignal(false);

    const handleTicketClick = $((event: MouseEvent) => {
        const ctrlOrCmdPressed = event.ctrlKey || event.metaKey;

        if (onSelect$) {
            onSelect$({ ticketNumber: ticket.number, ctrlOrCmd: ctrlOrCmdPressed });
        }

        if (!isMultiSelectMode && !ctrlOrCmdPressed) {
            showModal.value = true;
        }
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
                onClick$={(event) => handleTicketClick(event)}
                class={`p-4 ticket ${ticket.status === 'unsold'
                    ? 'unsold'
                    : ticket.status === 'sold-unpaid'
                        ? 'pending'
                        : 'paid'
                    } ${isSelected ? 'selected' : ''}`}
                title={ticket.buyerName || ''}
            >
                <div class="ticket-content">
                    <div class="ticket-number">{ticket.number}</div>
                    {showBuyerName && ticket.buyerName && (
                        <div class="ticket-buyer-name" title={ticket.buyerName}>
                            {ticket.buyerName}
                        </div>
                    )}
                </div>
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