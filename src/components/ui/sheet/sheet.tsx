import { Slot, component$, useSignal } from '@builder.io/qwik';
import { LuX } from '@qwikest/icons/lucide';
import { Button, Modal, buttonVariants } from '~/components/ui';
import { cn } from '@qwik-ui/utils';
import { _ } from 'compiled-i18n';

export interface SheetProps {
    position?: 'right' | 'left' | 'top' | 'bottom';
    width?: string;
    height?: string;
}

export const Sheet = component$<SheetProps>(({ position = 'right', width = '380px', height = '80vh' }) => {
    const show = useSignal(false);

    const getTransformStyles = () => {
        switch (position) {
            case 'top': return { top: 0, left: 0, right: 0, transform: 'translateY(-100%)', width: '100%', height };
            case 'bottom': return { bottom: 0, left: 0, right: 0, transform: 'translateY(100%)', width: '100%', height };
            case 'left': return { top: 0, bottom: 0, left: 0, transform: 'translateX(-100%)', width, height: '100%' };
            case 'right': return { top: 0, bottom: 0, right: 0, transform: 'translateX(100%)', width, height: '100%' };
            default: return { top: 0, bottom: 0, right: 0, transform: 'translateX(100%)', width, height: '100%' };
        }
    };

    return (
        <Modal.Root bind:show={show}>
            <Modal.Trigger>
                <Slot name="trigger" />
            </Modal.Trigger>
            <div
                class="fixed inset-0 bg-black/50 z-40"
                aria-hidden="true"
                onClick$={() => show.value = false}
            />
            <div
                class={cn(
                    'fixed bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out z-50',
                    show.value ? 'translate-x-0 translate-y-0' : '',
                )}
                style={getTransformStyles()}
            >
                <div class="p-6 h-full flex flex-col overflow-auto">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">
                            <Slot name="title" />
                        </h3>
                        <button
                            class={cn(
                                buttonVariants({ size: 'icon', look: 'ghost' }),
                            )}
                            type="button"
                            onClick$={() => show.value = false}
                        >
                            <LuX class="h-5 w-5" />
                        </button>
                    </div>
                    <div class="flex-1 overflow-auto">
                        <Slot />
                    </div>
                    <div class="mt-6 flex justify-end">
                        <Slot name="footer">
                            <Button look="primary" onClick$={() => (show.value = false)}>
                                {_`Close`}
                            </Button>
                        </Slot>
                    </div>
                </div>
            </div>
        </Modal.Root>
    );
});
