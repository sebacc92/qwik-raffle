import { $, component$ } from '@builder.io/qwik'
import { useForm, valiForm$ } from '@modular-forms/qwik'
import { type RaffleForm, type RaffleResponseData, RaffleSchema } from '~/schemas/raffleSchema'
import { useFormRaffleAction } from '~/shared/forms/actions'
import { useFormRaffleLoader } from '~/shared/forms/loaders'

export default component$(() => {
    const [raffleForm, { Form, Field }] = useForm<RaffleForm, RaffleResponseData>({
        loader: useFormRaffleLoader(),
        action: useFormRaffleAction(),
        validate: valiForm$(RaffleSchema)
    })
    console.log('raffleForm', raffleForm)

    const handleSubmit = $((values: RaffleForm) => {
        console.log('values', values)
    })
    
    return (
        <Form onSubmit$={handleSubmit} class="space-y-4">
            <Field name="name">
                {(field, props) => (
                    <input
                        {...props}
                    />
                )}
            </Field>
            <button type="submit" class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90">
                Crear Sorteo
            </button>
        </Form>
    )
})