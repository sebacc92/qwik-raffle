import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import RaffleForm from "~/components/forms/raffleForm";
import { Card } from "~/components/ui";

export { useFormRaffleLoader } from "~/shared/forms/loaders";
export { useFormRaffleAction } from "~/shared/forms/actions";

export default component$(() => {
  return (
    <div class="flex justify-center items-center min-h-screen bg-gray-50">
      <Card.Root class="w-full max-w-[550px] mx-4 animate-fadeIn">
        <Card.Header>
          <Card.Title>Create New Raffle</Card.Title>
          <Card.Description>Enter the information for your raffle</Card.Description>
        </Card.Header>
        <Card.Content>
          <RaffleForm />
        </Card.Content>
      </Card.Root>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik Raffle - Create Raffle",
  meta: [
    {
      name: "description",
      content: "Create a new raffle quickly with Qwik Raffle",
    },
  ],
};
