import { Slot, component$ } from '@builder.io/qwik';
import { Modal } from '@qwik-ui/headless';

export interface ConfirmationProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm$?: () => void;
  onCancel$?: () => void;
}

export const Confirmation = component$<ConfirmationProps>((props) => {
    return (
        <Modal.Root alert>
            <Modal.Trigger class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                <Slot />
            </Modal.Trigger>
            
            <Modal.Panel class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <Modal.Title class="text-lg font-semibold leading-none tracking-tight">
                {props.title || 'Confirm Action'}
                </Modal.Title>
                
                <Modal.Description class="text-sm text-muted-foreground">
                {props.message || 'Are you sure you want to proceed with this action?'}
                </Modal.Description>

                <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <Modal.Close
                    onClick$={props.onCancel$}
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                    {props.cancelText || 'Cancel'}
                </Modal.Close>
                <Modal.Close
                    onClick$={props.onConfirm$}
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2"
                >
                    {props.confirmText || 'Confirm'}
                </Modal.Close>
                </div>
            </Modal.Panel>
        </Modal.Root>
  );
});