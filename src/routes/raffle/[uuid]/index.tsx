import { component$, useSignal, $, useStylesScoped$, useVisibleTask$, type PropFunction } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { toast } from 'qwik-sonner';
import { useGetRaffle, useGetRaffleNumbers } from "~/shared/loaders";
import styles from './raffle.css?inline';
import Ticket from "~/components/raffle/ticket";
import { LuUsers, LuCreditCard, LuDollarSign, LuGift, LuSearch, LuLink, LuDownload, LuTrash2, LuTrophy, LuX, LuClipboardList, LuInfo, LuLayoutGrid, LuList } from '@qwikest/icons/lucide';
import { useNavigate } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Alert, Button, Modal } from "~/components/ui";
import TicketForm from "~/components/forms/ticketForm";

export { useGetRaffle, useGetRaffleNumbers } from "~/shared/loaders";

// Types for raffle tickets/numbers
export interface Ticket {
    id?: number;
    number: number;
    status: "unsold" | "sold-unpaid" | "sold-paid";
    buyerName: string | null;
    buyerPhone: string | null;
    paymentStatus?: boolean;
    notes: string | null;
}

export default component$(() => {
    useStylesScoped$(styles);
    const navigate = useNavigate();

    const raffle = useGetRaffle();
    const raffleNumbers = useGetRaffleNumbers();
    
    const search = useSignal("");
    const showOnlyPending = useSignal(false);
    
    // Señales para la selección múltiple
    const isMultiSelectMode = useSignal(false);
    const selectedTickets = useSignal<number[]>([]);
    const showMultiSelectForm = useSignal(false);
    const isMac = useSignal(false);

    // *** NUEVAS SEÑALES PARA VISUALIZACIÓN ***
    const showBuyerNameOnTicket = useSignal(false); // Para mostrar nombre en la casilla
    const viewMode = useSignal<'grid' | 'list'>('grid'); // Para cambiar entre grid y lista
    const editingTicket = useSignal<Ticket | null>(null); // Para editar desde la tabla
    const isEditModalOpen = useSignal(false); // *** NUEVA SEÑAL BOOLEANA PARA EL MODAL ***

    // Detectar si es Mac o Windows para mostrar la tecla correcta
    useVisibleTask$(() => {
        isMac.value = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    });

    // Function to format a date
    const formatDate = $((dateInput: Date | string | number | null | undefined) => {
        if (!dateInput) return null;
        
        try {
            const date = new Date(dateInput);
            // Check if date is valid
            if (isNaN(date.getTime())) return null;
            
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return null;
        }
    });

    // Signals for draw functionality
    const showDrawConfirmation = useSignal(false);
    const showResetConfirmation = useSignal(false);

    const generateClientLink = $(() => {
        if(raffle.value?.failed) return;
        const link = `${window.location.origin}/raffle/${raffle.value?.uuid}/client`;
        navigator.clipboard.writeText(link);
        toast.info("Link copied");
    });

    const downloadRaffleInfo = $(() => {
        if(raffle.value?.failed) return;
        let info = `Raffle Information: ${raffle.value?.name}\n\n`;
        info += `Price per number: $${raffle.value?.pricePerNumber}\n`;
        info += `Total numbers: ${raffle.value?.numberCount}\n`;

        const soldCount = raffleNumbers.value.filter(t => t.status !== "unsold").length;
        const paidCount = raffleNumbers.value.filter(t => t.status === "sold-paid").length;
        const totalCollected = paidCount * raffle.value?.pricePerNumber;

        info += `Sold numbers: ${soldCount}\n`;
        info += `Paid numbers: ${paidCount}\n`;
        info += `Total collected: $${totalCollected.toFixed(2)}\n\n`;
        info += "Ticket details:\n";

        raffleNumbers.value.forEach(ticket => {
            info += `Number ${ticket.number}: `;
            switch (ticket.status) {
                case "unsold":
                    info += "Unsold\n";
                    break;
                case "sold-unpaid":
                    info += `Reserved by ${ticket.buyerName} (Pending payment)\n`;
                    break;
                case "sold-paid":
                    info += `Sold to ${ticket.buyerName}\n`;
                    break;
            }
        });

        const blob = new Blob([info], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `raffle_${raffle.value?.name.replace(/\s+/g, "_")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.info(_`Raffle information downloaded`);
    });

    // Function to start the draw process
    const startDrawProcess = $(() => {
        if (raffle.value.failed) return;
        
        if (!raffle.value.prizes || raffle.value.prizes.length === 0) {
            toast.error(_`This raffle has no registered prizes`, {
                duration: 3000,
                position: 'top-center'
            });
            return;
        }

        // Show confirmation modal
        showDrawConfirmation.value = true;
    });

    // Function to confirm and proceed with the draw
    const confirmDraw = $(() => {
        if (raffle.value.failed) return;

        // Filter tickets to only include paid tickets
        const paid = raffleNumbers.value.filter(t => t.status === "sold-paid");

        // Check if there are enough tickets
        const numberOfPrizes = raffle.value.prizes.length;
        if (paid.length < numberOfPrizes) {
            toast.error(_`There are not enough paid tickets to draw all the prizes`, {
                duration: 3000,
                position: 'top-center'
            });
            showDrawConfirmation.value = false;
            return;
        }

        // Hide confirmation and navigate to wheel page
        showDrawConfirmation.value = false;
        navigate(`/raffle/${raffle.value.uuid}/wheel`);
    });

    const confirmReset = $(() => {
        if (raffle.value.failed) return;

        // Aquí iría la lógica para resetear el sorteo
        alert(_`Raffle reset`);
        showResetConfirmation.value = false;
    });

    // Funciones para la selección múltiple
    const toggleMultiSelectMode = $(() => {
        isMultiSelectMode.value = !isMultiSelectMode.value;
        if (!isMultiSelectMode.value) {
            selectedTickets.value = [];
        }
    });

    const handleTicketSelection: PropFunction<(payload: { ticketNumber: number; ctrlOrCmd: boolean }) => void> = $(
        ({ ticketNumber, ctrlOrCmd }) => {
            // Modificar selección si Ctrl/Cmd está presionado O si el modo multi-select está activado
            if (ctrlOrCmd || isMultiSelectMode.value) {
                const currentSelection = selectedTickets.value;
                const index = currentSelection.indexOf(ticketNumber);
                if (index === -1) {
                    // Añadir a la selección
                    selectedTickets.value = [...currentSelection, ticketNumber].sort((a, b) => a - b); // Mantener ordenado
                } else {
                    // Quitar de la selección
                    selectedTickets.value = currentSelection.filter(n => n !== ticketNumber);
                }
            } 
            // Si no se presionó Ctrl/Cmd y el modo no está activo, no hacemos nada aquí
            // (el componente Ticket se encarga de abrir el modal de edición simple)
        }
    );

    const openMultiSelectForm = $(() => {
        if (selectedTickets.value.length > 0) {
            showMultiSelectForm.value = true;
        } else {
            toast.error(_`Por favor, selecciona al menos un ticket primero`, {
                duration: 3000,
                position: 'top-center'
            });
        }
    });

    const handleMultiSelectSuccess = $(() => {
        showMultiSelectForm.value = false;
        selectedTickets.value = [];
        isMultiSelectMode.value = false;
        toast.success(_`Tickets actualizados correctamente!`);
    });

    const handleCancelMultiSelect = $(() => {
        showMultiSelectForm.value = false;
    });

    // *** CORREGIDO: Función para abrir modal desde tabla (con $) ***
    const openEditModalFromList = $((ticket: Ticket) => {
        editingTicket.value = ticket;
        isEditModalOpen.value = true; // <-- Abrir modal
    });

    // *** CORREGIDO: Función para cerrar modal de edición (con $) ***
    const closeEditModal = $(() => {
        editingTicket.value = null; // Cierra modal de tabla
        isEditModalOpen.value = false; // <-- Cerrar modal
        showMultiSelectForm.value = false; // Cierra modal multiselect (si estaba abierto)
        // No necesitamos cerrar el modal individual del componente Ticket aquí,
        // ya que ese tiene su propia lógica interna de cierre.
    });
    
    // *** CORREGIDO: Función al éxito de edición (con $) ***
    const handleEditSuccess = $(() => {
        closeEditModal(); 
        selectedTickets.value = []; // Limpia selección múltiple si aplica
        isMultiSelectMode.value = false; // Desactiva modo multiselect si aplica
        toast.success(_`Ticket actualizado correctamente!`);
    });

    if(raffle.value?.failed){
        return (
            <div class="p-4 max-w-7xl mx-auto">
                <h1 class="text-2xl font-bold text-purple-800">{_`Raffle not found`}</h1>
                <p class="text-purple-600">{_`The raffle you are looking for does not exist or has been deleted.`}</p>
            </div>
        );
    }

    const soldCount = raffleNumbers.value.filter(t => t.status !== "unsold").length;
    const paidCount = raffleNumbers.value.filter(t => t.status === "sold-paid").length;
    const totalCollected = paidCount * raffle.value.pricePerNumber;

    // *** MOVER FILTRADO FUERA PARA REUTILIZAR ***
    const filteredTickets = raffleNumbers.value
        .filter(ticket =>
            (!showOnlyPending.value || ticket.status === "sold-unpaid") &&
            (!search.value ||
                ticket.number.toString().includes(search.value) ||
                (ticket.buyerName && ticket.buyerName.toLowerCase().includes(search.value.toLowerCase())))
        );

    return (
        <div class="p-4 max-w-7xl mx-auto space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 class="text-2xl font-bold text-purple-800">{raffle.value.name}</h1>
                
                {/* Raffle info section with expiration date - only show if it exists */}
                {raffle.value.expiresAt && (
                    <div class="expiration-date">
                        <p class="text-amber-600 dark:text-amber-400">
                            <span class="font-medium">{_`Raffle ends on:`}</span> {formatDate(raffle.value.expiresAt)}
                        </p>
                    </div>
                )}
                
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                        onClick$={generateClientLink}
                        class="link-button"
                    >
                        <LuLink class="w-4 h-4" />
                        {_`Copy Link`}
                    </button>
                    <button
                        onClick$={downloadRaffleInfo}
                        class="link-button"
                    >
                        <LuDownload class="w-4 h-4" />
                        {_`Download Information`}
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="stats-card bg-white">
                    <div class="flex items-center">
                        <div class="stats-icon">
                            <LuUsers class="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <div class="text-sm text-purple-600">{_`Sold Tickets`}</div>
                            <div class="text-xl sm:text-2xl font-bold">{soldCount}/{raffle.value.numberCount}</div>
                        </div>
                    </div>
                </div>

                <div class="stats-card bg-white">
                    <div class="flex items-center">
                        <div class="stats-icon">
                            <LuCreditCard class="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <div class="text-sm text-amber-500">{_`Paid Tickets`}</div>
                            <div class="text-xl sm:text-2xl font-bold">{paidCount}/{raffle.value.numberCount}</div>
                        </div>
                    </div>
                </div>

                <div class="stats-card bg-white">
                    <div class="flex items-center">
                        <div class="stats-icon">
                            <LuDollarSign class="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <div class="text-sm text-emerald-500">{_`Total Collected`}</div>
                            <div class="text-xl sm:text-2xl font-bold">${totalCollected.toFixed(2)}</div>
                            <div class="text-xs text-emerald-400">{_`Price per ticket: `}${raffle.value.pricePerNumber.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="relative w-full sm:w-auto sm:flex-1">
                    <LuSearch class="search-icon w-4 h-4" />
                    <input
                        type="text"
                        placeholder={_`Search number or name`}
                        class="search-input"
                        value={search.value}
                        onInput$={(e: any) => search.value = e.target.value}
                    />
                </div>
                <div class="flex items-center gap-4 w-full sm:w-auto">
                    <div class="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="pending"
                            checked={showOnlyPending.value}
                            onChange$={() => showOnlyPending.value = !showOnlyPending.value}
                        />
                        <label for="pending" class="text-sm sm:text-base">
                            {_`Show only pending`}
                        </label>
                    </div>
                    <div class="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="multiSelect"
                            checked={isMultiSelectMode.value}
                            onChange$={toggleMultiSelectMode}
                        />
                        <label for="multiSelect" class="text-sm sm:text-base">
                            {_`Multi-select mode`}
                        </label>
                    </div>
                     {/* *** NUEVO CHECKBOX PARA MOSTRAR NOMBRE *** */}
                     <div class="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="showName"
                            checked={showBuyerNameOnTicket.value}
                            onChange$={() => showBuyerNameOnTicket.value = !showBuyerNameOnTicket.value}
                        />
                        <label for="showName" class="text-sm sm:text-base">
                            {_`Show name`}
                        </label>
                    </div>
                     {/* *** NUEVOS BOTONES PARA MODO DE VISTA *** */}
                     <div class="flex items-center gap-1 border border-purple-200 dark:border-purple-700 rounded-md p-0.5">
                        <button
                            onClick$={() => viewMode.value = 'grid'}
                            class={`p-1 rounded ${viewMode.value === 'grid' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            aria-label={_`Grid view`}
                            title={_`Grid view`}
                        >
                            <LuLayoutGrid class="w-4 h-4" />
                        </button>
                        <button
                            onClick$={() => viewMode.value = 'list'}
                            class={`p-1 rounded ${viewMode.value === 'list' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            aria-label={_`List view`}
                            title={_`List view`}
                        >
                            <LuList class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <Alert.Root look="primary">
                <LuInfo class="w-5 h-5 text-purple-600" />
                <Alert.Title>{_`Multiselect mode`}</Alert.Title>
                <Alert.Description>
                    {isMac.value ? 
                        _`Presiona ⌘ + clic para seleccionar o deseleccionar múltiples tickets` : 
                        _`Presiona Ctrl + clic para seleccionar o deseleccionar múltiples tickets`
                    }
                </Alert.Description>
            </Alert.Root>

            {/* Multi-select instructions and actions */}
            {selectedTickets.value.length > 0 && (
                <div class="multi-select-bar">
                    <div class="flex flex-col gap-2">
                        
                        <div class="flex flex-wrap gap-1">
                            <span class="text-sm font-medium mr-1">{_`Seleccionados:`}</span>
                            {selectedTickets.value.map(number => (
                                <span key={number} class="inline-block bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-xs">
                                    #{number}
                                </span>
                            ))}
                        </div>

                        <p class="text-sm text-purple-600"> 
                            {_`${selectedTickets.value.length} tickets seleccionados`}
                        </p>
                    </div>
                    <button 
                        onClick$={openMultiSelectForm}
                        class="action-button primary mt-2 sm:mt-0"
                    >
                        <LuClipboardList class="w-4 h-4" />
                        {_`Asignar tickets seleccionados`}
                    </button>
                </div>
            )}

            {/* *** RENDERIZADO CONDICIONAL DE VISTA *** */}
            {viewMode.value === 'grid' ? (
                // *** VISTA DE CUADRÍCULA (GRID) ***
                <div class="ticket-container">
                    <div class="ticket-grid">
                        {/* Usar filteredTickets */}
                        {filteredTickets.map(ticket => (
                            <Ticket
                                key={ticket.number}
                                ticket={ticket}
                                raffleId={raffle.value.id || 0}
                                isMultiSelectMode={isMultiSelectMode.value}
                                isSelected={selectedTickets.value.includes(ticket.number)}
                                showBuyerName={showBuyerNameOnTicket.value} // <-- Pasar nueva prop
                                onSelect$={handleTicketSelection}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                // *** VISTA DE LISTA/TABLA ***
                <div class="overflow-x-auto ticket-table-container">
                    <table class="w-full ticket-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{_`Status`}</th>
                                <th>{_`Buyer Name`}</th>
                                <th>{_`Phone`}</th>
                                <th>{_`Notes`}</th>
                                <th>{_`Actions`}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Usar filteredTickets */}
                            {filteredTickets.map(ticket => (
                                <tr key={ticket.number} class={`status-${ticket.status}`}>
                                    <td class="font-medium">{ticket.number}</td>
                                    <td>
                                        <span class={`status-badge status-${ticket.status}`}>
                                            {ticket.status === 'unsold' ? _`Unsold` : 
                                             ticket.status === 'sold-unpaid' ? _`Pending` : _`Paid`}
                                        </span>
                                    </td>
                                    <td>{ticket.buyerName || '-'}</td>
                                    <td>{ticket.buyerPhone || '-'}</td>
                                    <td class="notes-cell">{ticket.notes || '-'}</td>
                                    <td>
                                        {/* *** BOTÓN CONDICIONAL: Vender o Editar *** */}
                                        {ticket.status === 'unsold' ? (
                                            <Button 
                                                look="primary" // Cambiar a look primario para destacar "Vender"
                                                size="sm"
                                                onClick$={() => openEditModalFromList(ticket)}
                                            >
                                                {_`Sell`}
                                            </Button>
                                        ) : (
                                            <Button 
                                                look="link" 
                                                size="sm"
                                                onClick$={() => openEditModalFromList(ticket)}
                                            >
                                                {_`Edit`}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredTickets.length === 0 && (
                                <tr>
                                    <td colSpan={6} class="text-center py-4 text-gray-500">{_`No tickets match the current filters.`}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <div class="border rounded-lg p-4 space-y-2">
                <h3 class="font-semibold text-purple-800">{_`Color Reference`}</h3>
                <div class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-purple-200 rounded"></div>
                        <span>{_`Unsold`}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                        <span>{_`Sold (Pending payment)`}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                        <span>{_`Sold and paid`}</span>
                    </div>
                </div>
            </div>

            {/* Prizes list */}
            {raffle.value.prizes.length > 0 && (
                <div class="border rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <LuGift class="w-5 h-5 text-purple-600" />
                        <h3 class="font-semibold text-purple-800">{_`Prizes`}</h3>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {raffle.value.prizes.sort((a, b) => a.position - b.position).map((prize) => (
                            <div 
                                key={prize.id}
                                class="flex items-center gap-2 bg-purple-50 rounded-md p-3"
                            >
                                <span class="flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm font-medium">
                                    {prize.position}
                                </span>
                                <span class="text-purple-900">{prize.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div class="flex justify-center gap-4">
                <Button
                    look="success"
                    onClick$={startDrawProcess}
                    class="finalize-button"
                >
                    <LuTrophy class="w-4 h-4 mr-1" />
                    <span>{_`Finalize and Draw`}</span>
                </Button>
                <Button
                    look="cancel"
                    onClick$={() => showResetConfirmation.value = true}
                    class="reset-button"
                >
                    <LuTrash2 class="w-4 h-4 mr-1" />
                    <span>{_`Reset Raffle`}</span>
                </Button>
            </div>

            {/* Multi-select form modal */}
            {showMultiSelectForm.value && (
                <div class="confirmation-dialog">
                    <div class="confirmation-content">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="confirmation-title">{_`Asignar ${selectedTickets.value.length} tickets`}</h2>
                            <button
                                onClick$={handleCancelMultiSelect}
                                class="text-gray-500 hover:text-gray-700"
                            >
                                <LuX class="w-5 h-5" />
                            </button>
                        </div>
                        <div class="mb-4">
                            <p class="text-purple-700 font-medium mb-2">{_`Tickets seleccionados:`}</p>
                            <div class="flex flex-wrap gap-2 mb-4">
                                {selectedTickets.value.map(number => (
                                    <span key={number} class="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                                        #{number}
                                    </span>
                                ))}
                            </div>
                            <TicketForm 
                                raffleId={raffle.value.id || 0}
                                initialBuyerName=""
                                initialBuyerPhone=""
                                initialNotes=""
                                initialStatus="sold-paid"
                                selectedTickets={selectedTickets.value}
                                onSuccess$={handleMultiSelectSuccess}
                                onCancel$={handleCancelMultiSelect}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* *** MODAL DE EDICIÓN (PARA TABLA Y POTENCIALMENTE INDIVIDUAL SI REFACTORIZAMOS) *** */}
             <Modal.Root bind:show={isEditModalOpen}>
                <Modal.Panel class="modal-edit-ticket">
                    <Modal.Close
                        class="absolute right-4 top-4 text-purple-700 hover:text-purple-900 transition-colors"
                        onClick$={closeEditModal}
                    >
                        <LuX class="h-5 w-5" />
                    </Modal.Close>
                    {editingTicket.value && ( // Asegurar que ticket no sea null
                        <TicketForm 
                            raffleId={raffle.value.id || 0}
                            ticketNumber={editingTicket.value.number}
                            initialBuyerName={editingTicket.value.buyerName}
                            initialBuyerPhone={editingTicket.value.buyerPhone}
                            initialNotes={editingTicket.value.notes}
                            initialStatus={editingTicket.value.status}
                            onSuccess$={handleEditSuccess}
                            onCancel$={closeEditModal}
                        />
                    )}
                </Modal.Panel>
            </Modal.Root>

            {/* Confirmation modal for draw */}
            {showDrawConfirmation.value && (
                <div class="confirmation-dialog">
                    <div class="confirmation-content">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="confirmation-title">{_`Confirm Draw`}</h2>
                            <button
                                onClick$={() => showDrawConfirmation.value = false}
                                class="text-gray-500 hover:text-gray-700"
                            >
                                <LuX class="w-5 h-5" />
                            </button>
                        </div>
                        <p class="mb-4">
                            {_`Are you sure you want to finalize the raffle and draw ${raffle.value.prizes.length} prize(s)?`}
                        </p>
                        {!!raffleNumbers.value.filter(t => t.status === "sold-unpaid").length && (
                            <p class="mb-4 text-amber-600">
                                {_`There are ${raffleNumbers.value.filter(t => t.status === "sold-unpaid").length} ticket(s) with pending payment. These tickets will NOT be included in the draw.`}
                            </p>
                        )}
                        <div class="confirmation-actions">
                            <button
                                onClick$={() => showDrawConfirmation.value = false}
                                class="action-button secondary"
                            >
                                {_`Cancel`}
                            </button>
                            <button
                                onClick$={confirmDraw}
                                class="action-button success"
                            >
                                {_`Continue with the draw`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation modal for reset */}
            {showResetConfirmation.value && (
                <div class="confirmation-dialog">
                    <div class="confirmation-content">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="confirmation-title">{_`Confirm Reset`}</h2>
                            <button
                                onClick$={() => showResetConfirmation.value = false}
                                class="text-gray-500 hover:text-gray-700"
                            >
                                <LuX class="w-5 h-5" />
                            </button>
                        </div>
                        <p class="mb-4">
                            {_`Are you sure you want to reset this raffle? All tickets will be marked as unsold.`}
                        </p>
                        <div class="confirmation-actions">
                            <button
                                onClick$={() => showResetConfirmation.value = false}
                                class="action-button secondary"
                            >
                                {_`Cancel`}
                            </button>
                            <button
                                onClick$={confirmReset}
                                class="action-button warning"
                            >
                                {_`Reset Raffle`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export const head: DocumentHead = ({ resolveValue }) => {
    const raffle = resolveValue(useGetRaffle);
    const title = raffle.failed
        ? raffle.errorMessage
        : _`Qwik Raffle - ${raffle.name}`;
    const description = raffle.failed
        ? _`Raffle not found`
        : _`Raffle details ${raffle.name}`;
    return {
        title,
        meta: [
            {
                name: "description",
                content: description,
            },
        ],
    };
};
