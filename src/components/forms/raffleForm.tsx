import { $, component$ } from '@builder.io/qwik'
import { useForm, valiForm$ } from '@modular-forms/qwik'
import { Button, Input, Label } from '~/components/ui'
import { type RaffleForm, type RaffleResponseData, RaffleSchema } from '~/schemas/raffleSchema'
import { useFormRaffleAction } from '~/shared/forms/actions'
import { useFormRaffleLoader } from '~/shared/forms/loaders'

export default component$(() => {
    const [raffleForm, { Form, Field }] = useForm<RaffleForm, RaffleResponseData>({
        loader: useFormRaffleLoader(),
        action: useFormRaffleAction(),
        validate: valiForm$(RaffleSchema)
    })

    const handleSubmit = $((values: RaffleForm) => {
        console.log('values', values)
    })
    
    return (
        <Form onSubmit$={handleSubmit} class="space-y-4">
            <Field name="name">
                {(field, props) => (
                    <>
                        <Label>Name of Raffle</Label>
                        <Input
                            {...props}
                            type="text"
                            maxLength={100}
                            value={field.value}
                        />
                        {field.error && <div>{field.error}</div>}
                    </>
                )}
            </Field>
            <Field name="numberCount" type="number">
                {(field, props) => (
                    <>
                        <Label>Quantity of numbers</Label>
                        <Input
                            {...props}
                            type="number"
                            min={2}
                            max={1000}
                            value={field.value}
                        />
                        {field.error && <div>{field.error}</div>}
                    </>
                )}
            </Field>
            <Field name="pricePerNumber" type="number">
                {(field, props) => (
                    <>
                        <Label>Price per number $</Label>
                        <Input
                            {...props}
                            type="number"
                            min={0.01}
                            max={10000}
                            step="0.01"
                            value={field.value}
                        />
                        {field.error && <div>{field.error}</div>}
                    </>
                )}
            </Field>
            <Button
                type="submit"
                look="primary"
                class="w-full"
            >
                Crear Sorteo
            </Button>
        </Form>
    )
})