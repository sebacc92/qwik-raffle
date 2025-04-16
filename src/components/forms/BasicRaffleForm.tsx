import { $, component$, useSignal, useTask$ } from '@builder.io/qwik'
import { useNavigate } from '@builder.io/qwik-city'
import { useForm, valiForm$, insert, remove, setValue } from '@modular-forms/qwik'
import { toast } from 'qwik-sonner';
import { Button, Input, Label, Textarea } from '~/components/ui'
import { type RaffleForm, type RaffleResponseData, BasicRaffleSchema } from '~/schemas/raffleSchema'
import { useFormRaffleAction } from '~/shared/forms/actions'
import { useFormRaffleLoader } from '~/shared/forms/loaders'
import { LuTrash, LuPlus } from '@qwikest/icons/lucide'
import { CustomToggle } from '~/components/CustomToggle';
import { _ } from 'compiled-i18n';

export default component$(() => {
    const nav = useNavigate();
    const [raffleForm, { Form, Field, FieldArray }] = useForm<RaffleForm, RaffleResponseData>({
        loader: useFormRaffleLoader(),
        action: useFormRaffleAction(),
        fieldArrays: ['prizes'],
        validate: valiForm$(BasicRaffleSchema)
    })

    const isPubic = useSignal<boolean>(false);
    const showEndDate = useSignal<boolean>(false);
    const isSubmitting = useSignal(false);

    useTask$(() => {
        if (!raffleForm.internal.fields.expiresAt?.value) {
            setValue(raffleForm, 'expiresAt', '');
        }
    });

    useTask$(({ track }) => {
        track(() => raffleForm.response.status)
        
        if (raffleForm.response.status === 'success') {
            isSubmitting.value = false;
            const url = raffleForm.response.data?.data?.share_link
            if (url) {
                toast.success("Raffle created successfully");
                nav(url)
            }
        } else if (raffleForm.response.status === 'error') {
            isSubmitting.value = false;
        }
    })

    const handleSubmit = $((values: RaffleForm) => {
        isSubmitting.value = true;
        console.log('values', values)
    })

    return (
        <Form onSubmit$={handleSubmit} class="space-y-5 w-full">
            <Field name="name">
                {(field, props) => (
                    <div class="space-y-1.5">
                        <Label for="raffle-name" class="flex items-center">
                            <span class="inline-block mr-2 text-primary font-bold">#</span>
                            {_`Raffle Name`}
                        </Label>
                        <Input
                            {...props}
                            id="raffle-name"
                            type="text"
                            maxLength={100}
                            value={field.value || ''}
                            placeholder={_`Enter a descriptive name for your raffle`}
                            class="transition-all duration-200 focus:border-primary hover:border-gray-400 dark:hover:border-gray-600"
                        />
                        {field.error && <div class="text-alert text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {field.error}
                        </div>}
                        <div class="text-sm text-gray-500">{(field.value?.length || 0)}/100 {_`characters`}</div>
                    </div>
                )}
            </Field>

            <Field name="description">
                {(field, props) => (
                    <div class="space-y-1.5">
                        <Label for="raffle-description" class="flex items-center">
                            {_`Description/Note (optional)`}
                        </Label>
                        <Textarea
                            {...props}
                            id="raffle-description"
                            maxLength={500}
                            value={field.value || ''}
                            placeholder={_`Add a description or additional details about your raffle`}
                            class="w-full px-3 py-2 border rounded-md transition-all duration-200 focus:border-primary hover:border-gray-400 dark:hover:border-gray-600 dark:bg-gray-800"
                        />
                        {field.error && <div class="text-alert text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {field.error}
                        </div>}
                        <div class="text-sm text-gray-500">{(field.value?.length || 0)}/500 {_`characters`}</div>
                    </div>
                )}
            </Field>

            {/* Flex container for number fields */}
            <div class="flex gap-6">
                <Field name="numberCount" type="number">
                    {(field, props) => (
                        <div class="space-y-1.5 flex-1">
                            <Label for="number-quantity" class="flex items-center whitespace-nowrap">
                                <span class="inline-block mr-2 text-primary font-bold">+</span>
                                {_`Number Quantity`}
                            </Label>
                            <Input
                                {...props}
                                id="number-quantity"
                                type="number"
                                min={2}
                                max={1000}
                                value={field.value || 0}
                                placeholder={_`Set the quantity of numbers/tickets`}
                                class="transition-all duration-200 focus:border-primary hover:border-gray-400 dark:hover:border-gray-600"
                            />
                            {field.error && <div class="text-alert text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {field.error}
                            </div>}
                            <div class="text-xs text-muted-foreground mt-1">
                                <span class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {_`Basic accounts limited to 1,000 max`}
                                </span>
                            </div>
                        </div>
                    )}
                </Field>

                <Field name="pricePerNumber" type="number">
                    {(field, props) => (
                        <div class="space-y-1.5 flex-1">
                            <Label for="price-per-number" class="flex items-center whitespace-nowrap">
                                <span class="inline-block mr-2 text-primary font-bold">$</span>
                                {_`Price per number`}
                            </Label>
                            <Input
                                {...props}
                                id="price-per-number"
                                type="number"
                                min={0.01}
                                max={10000}
                                step="0.01"
                                value={field.value || ''}
                                placeholder={_`Set the price for each number/ticket`}
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

            {/* Prizes section */}
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <Label class="flex items-center">
                        <span class="inline-block mr-2 text-primary font-bold">🎁</span>
                        {_`Prizes`}
                    </Label>
                    <div class="text-xs text-muted-foreground">
                        <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {_`Free accounts limited to 5 prizes`}
                        </span>
                    </div>
                </div>

                <FieldArray name="prizes">
                    {(fieldArray) => (
                        <div class="space-y-4">
                            {fieldArray.items.map((prize, index) => (
                                <div key={index} class="flex items-start gap-4">
                                    <div class="flex-1">
                                        <Field name={`prizes.${index}.name`}>
                                            {(field, props) => (
                                                <div class="space-y-1.5">
                                                    <Label for={`prize-${index}`}>{_`Prize`} {index + 1}</Label>
                                                    <Input
                                                        {...props}
                                                        id={`prize-${index}`}
                                                        type="text"
                                                        value={field.value || ''}
                                                        placeholder={_`Enter prize ${index + 1} name`}
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
                                    <Field name={`prizes.${index}.position`} type="number">
                                        {(field, props) => (
                                            <input type="hidden" {...props} value={index + 1} />
                                        )}
                                    </Field>
                                    {fieldArray.items.length > 1 && (
                                        <button
                                            type="button"
                                            class="mt-8 p-2 text-gray-500 hover:text-red-500 transition-colors"
                                            onClick$={() => remove(raffleForm, 'prizes', { at: index })}
                                            aria-label={_`Remove prize`}
                                        >
                                            <LuTrash class="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {fieldArray.items.length < 5 && (
                                <button
                                    type="button"
                                    onClick$={() => {
                                        const numberCount = raffleForm.internal.fields.numberCount?.value;
                                        if (numberCount && fieldArray.items.length >= numberCount) {
                                            toast.error(_`Number of prizes must be less than the number count (${numberCount})`);
                                            return;
                                        }
                                        insert(raffleForm, 'prizes', {
                                            value: { name: '', position: fieldArray.items.length + 1 }
                                        });
                                    }}
                                    class="inline-flex items-center text-sm text-primary hover:text-primary/80"
                                >
                                    <LuPlus class="w-4 h-4 mr-1" />
                                    {_`Add Prize`}
                                </button>
                            )}
                        </div>
                    )}
                </FieldArray>
            </div>

            <div class="space-y-4">
                <h2 class="font-medium text-foreground">{_`Additional Settings`}</h2>
                <div>
                    <CustomToggle
                        id="expiresAt"
                        label={_`Set end date`}
                        checked={showEndDate.value}
                        onChange$={$((checked) => {
                            showEndDate.value = checked;
                            // Clear date when toggle is off
                            if (!checked) {
                                setValue(raffleForm, 'expiresAt', '');
                            }
                        })}
                    />
                    <Field name="expiresAt">
                        {(field, props) => (
                            <>
                                {showEndDate.value ? (
                                    <>
                                        <Label for="expiresAt" class="flex items-center">
                                            <span class="inline-block mr-2 text-primary font-bold">#</span>
                                            {_`End date`}
                                        </Label>
                                        <Input
                                            {...props}
                                            id="expiresAt"
                                            type="date"
                                            value={field.value || ''}
                                        />
                                        {field.error && (
                                            <div class="text-alert text-sm flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                {field.error}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    // Always render a hidden input with empty value when toggle is off
                                    <input type="hidden" {...props} value="" data-testid="expiresAt-hidden" />
                                )}
                            </>
                        )}
                    </Field>
                    <p class="mt-2 text-sm text-muted-foreground">
                        {_`Specify the date when the raffle will end. Numbers won't be available for purchase after this date.`}
                    </p>
                </div>
                <div class="space-y-4">
                    <CustomToggle
                        id="isPublic"
                        label={_`Public raffle`}
                        checked={isPubic.value}
                        onChange$={$((checked) => {
                            isPubic.value = checked;
                            setValue(raffleForm, 'isPublic', checked);
                        })}
                    />
                    <Field name="isPublic" type="boolean">
                        {(field, props) => (
                            <input type="hidden" {...props} value={field.value ? 'true' : 'false'} />
                        )}
                    </Field>
                    <p class="mt-2 text-sm text-muted-foreground">
                        {raffleForm.internal.fields.isPublic?.value
                            ? _`Any registered user can request numbers.`
                            : _`Accessible only via direct link.`}
                    </p>
                </div>
            </div>

            <div class="pt-2">
                <Button
                    type="submit"
                    look="primary"
                    class="w-full h-12 font-medium text-white transition-all duration-200 transform hover:shadow-md active:press flex items-center justify-center"
                    disabled={isSubmitting.value}
                >
                    {isSubmitting.value ? (
                        <>
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {_`Creating Raffle...`}
                        </>
                    ) : (
                        <>
                            <span class="mr-2">+</span>
                            {_`Create Raffle`}
                        </>
                    )}
                </Button>
            </div>
        </Form>
    )
})