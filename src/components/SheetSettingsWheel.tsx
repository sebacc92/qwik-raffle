import { type PropsOf, Slot, component$, useSignal } from '@builder.io/qwik';
import { LuX } from '@qwikest/icons/lucide';
import { Button, Input, Label, Modal, buttonVariants } from '~/components/ui';
import { cn } from '@qwik-ui/utils';

export interface SheetProps {
    position?: 'right' | 'left' | 'top' | 'bottom';
    width?: string;
    height?: string;
}

export default component$<PropsOf<typeof Modal.Panel>>(({ ...props }) => {
    const show = useSignal(false);
    return (
        <Modal.Root bind:show={show}>
            <Modal.Trigger class={[buttonVariants({ look: 'ghost' }), 'w-20']}>
                <Slot />
            </Modal.Trigger>
            <Modal.Panel {...props}>
                <Modal.Title>Edit Profile</Modal.Title>
                <Modal.Description>
                    Make changes to your profile here. Click save when you're done.
                </Modal.Description>
                <div class="mt-6">
                    <Label for="name" class="text-right">
                        Name
                    </Label>
                    <Input
                        name="name"
                        id="name"
                        defaultValue="Pedro Duarte"
                        class="col-span-3 w-[300px]"
                    />
                </div>
                <footer class="mt-6">
                    <Button look="primary" onClick$={() => (show.value = false)}>
                        Save
                    </Button>
                </footer>
                <Modal.Close
                    class={cn(
                        buttonVariants({ size: 'icon', look: 'link' }),
                        'absolute right-3 top-2',
                    )}
                    type="submit"
                >
                    <LuX class="h-5 w-5" />
                </Modal.Close>
            </Modal.Panel>
        </Modal.Root>
    );
});