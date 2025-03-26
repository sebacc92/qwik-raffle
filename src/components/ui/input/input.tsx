import { $, component$, type PropsOf } from "@builder.io/qwik";
import { cn } from "@qwik-ui/utils";

type InputProps = PropsOf<"input"> & {
  error?: string;
};

export const Input = component$<InputProps>(
  ({
    name,
    error,
    id,
    ["bind:value"]: valueSig,
    value,
    onInput$,
    ...props
  }) => {
    const inputId = id || name;

    return (
      <>
        <input
          {...props}
          aria-errormessage={`${inputId}-error`}
          aria-invalid={!!error}
          // workaround to support two way data-binding on the Input component (https://github.com/QwikDev/qwik/issues/3926)
          value={valueSig ? valueSig.value : value}
          onInput$={
            valueSig ? $((__, el) => (valueSig.value = el.value)) : onInput$
          }
          class={cn(
            "rounded-base border-input bg-background text-foreground file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            props.class,
          )}
          id={inputId}
          name={name}
        />
        {error && (
          <div id={`${inputId}-error`} class="text-alert mt-1 text-sm">
            {error}
          </div>
        )}
      </>
    );
  },
);
