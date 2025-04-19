import { $, component$, useSignal } from '@builder.io/qwik';
import { Label } from '~/components/ui'

interface CustomToggleProps {
    id: string;
    label: string;
    checked: boolean;
    onChange$: (checked: boolean) => void;
}

export const CustomToggle = component$<CustomToggleProps>(({ id, label, checked, onChange$ }) => {
    const isChecked = useSignal(checked);

    const handleToggle = $(() => {
        isChecked.value = !isChecked.value;
        // eslint-disable-next-line qwik/valid-lexical-scope
        onChange$(isChecked.value);
    });

    return (
        <div class="flex items-center space-x-3 py-2">
            <Label for={id} class="flex items-center cursor-pointer dark:text-gray-200" onClick$={handleToggle}>
                {label}
            </Label>
            <button
                type="button"
                onClick$={handleToggle}
                class={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900 ${
                    isChecked.value 
                        ? 'bg-blue-600 dark:bg-blue-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                }`}
            >
                <span
                    class={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-100 shadow transition-transform duration-200 ease-in-out ${
                        isChecked.value ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                />
            </button>
        </div>
    );
}); 