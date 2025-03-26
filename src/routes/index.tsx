import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import RaffleForm from "~/components/forms/raffleForm";
import { Card } from "~/components/ui";

export { useFormRaffleLoader } from "~/shared/forms/loaders";
export { useFormRaffleAction } from "~/shared/forms/actions";

export default component$(() => {
  return (
    <div class="flex justify-center items-center min-h-screen bg-gray-50">
      <Card.Root class="w-[400px]">
        <Card.Header>
          <Card.Title>Crear Nuevo Sorteo</Card.Title>
          <Card.Description>Introduce la información para tu sorteo</Card.Description>
        </Card.Header>
        <Card.Content>
          <RaffleForm />
        </Card.Content>
      </Card.Root>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik Raffle - Crear Sorteo",
  meta: [
    {
      name: "description",
      content: "Crea un nuevo sorteo rapidamente con Qwik Raffle",
    },
  ],
};
