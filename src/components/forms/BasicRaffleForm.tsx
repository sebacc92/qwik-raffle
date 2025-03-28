import { $, component$, useTask$ } from '@builder.io/qwik'
import { useNavigate } from '@builder.io/qwik-city'
import { useForm, valiForm$ } from '@modular-forms/qwik'
import { toast } from 'qwik-sonner';
import { Button, Input, Label } from '~/components/ui'
import { type RaffleForm, type RaffleResponseData, RaffleSchema } from '~/schemas/raffleSchema'
import { useFormRaffleAction } from '~/shared/forms/actions'
import { useFormRaffleLoader } from '~/shared/forms/loaders'

export default component$(() => {
    const nav = useNavigate();
    const [raffleForm, { Form, Field }] = useForm<RaffleForm, RaffleResponseData>({
        loader: useFormRaffleLoader(),
        action: useFormRaffleAction(),
        validate: valiForm$(RaffleSchema)
    })
    
    useTask$(({ track }) => {
        track(() => raffleForm.response.status)
        if (raffleForm.response.status === 'success') {
            const url = raffleForm.response.data?.data?.share_link
            if (url) {
                toast.success("Raffle created successfully");
                nav(url)
            }
        }
    })
    
    const handleSubmit = $((values: RaffleForm) => {
        console.log('values', values)
    })
    
    return (
        <Form onSubmit$={handleSubmit} class="space-y-5 w-full">
            <Field name="name">
                {(field, props) => (
                    <div class="space-y-1.5">
                        <Label for="raffle-name" class="flex items-center">
                            <span class="inline-block mr-2 text-primary font-bold">#</span>
                            Raffle Name
                        </Label>
                        <Input
                            {...props}
                            id="raffle-name"
                            type="text"
                            maxLength={100}
                            value={field.value}
                            placeholder="Enter a descriptive name"
                            class="transition-all duration-200 focus:border-primary hover:border-gray-400 dark:hover:border-gray-600"
                        />
                        {field.error && <div class="text-alert text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {field.error}
                        </div>}
                    </div>
                )}
            </Field>
            
            {/* Contenedor flex para los campos numéricos */}
            <div class="flex gap-6">
                <Field name="numberCount" type="number">
                    {(field, props) => (
                        <div class="space-y-1.5 flex-1">
                            <Label for="number-quantity" class="flex items-center whitespace-nowrap">
                                <span class="inline-block mr-2 text-primary font-bold">+</span>
                                Number Quantity
                            </Label>
                            <Input
                                {...props}
                                id="number-quantity"
                                type="number"
                                min={2}
                                max={1000}
                                value={field.value}
                                class="transition-all duration-200 focus:border-primary hover:border-gray-400 dark:hover:border-gray-600"
                            />
                            {field.error && <div class="text-alert text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {field.error}
                            </div>}
                        </div>
                    )}
                </Field>
                
                <Field name="pricePerNumber" type="number">
                    {(field, props) => (
                        <div class="space-y-1.5 flex-1">
                            <Label for="price-per-number" class="flex items-center whitespace-nowrap">
                                <span class="inline-block mr-2 text-primary font-bold">$</span>
                                Price per number
                            </Label>
                            <Input
                                {...props}
                                id="price-per-number"
                                type="number"
                                min={0.01}
                                max={10000}
                                step="0.01"
                                value={field.value}
                                class="transition-all duration-200 focus:border-primary hover:border-gray-400 dark:hover:border-gray-600"
                            />
                            {field.error && <div class="text-alert text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {field.error}
                            </div>}
                        </div>
                    )}
                </Field>
            </div>
            
            <div class="pt-2">
                <Button
                    type="submit"
                    look="primary"
                    class="w-full h-12 font-medium text-white transition-all duration-200 transform hover:shadow-md active:press flex items-center justify-center"
                >
                    <span class="mr-2">+</span>
                    Create Raffle
                </Button>
            </div>
        </Form>
    )
})