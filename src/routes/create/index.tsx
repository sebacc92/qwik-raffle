import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Card } from "~/components/ui";
import { useSession } from "~/routes/plugin@auth";

import GuestRaffleForm, { InfoAlert } from "~/components/forms/GuestRaffleForm";
import BasicRaffleForm from "~/components/forms/BasicRaffleForm";
import PremiumRaffleForm from "~/components/forms/PremiumRaffleForm";

export { useFormRaffleLoader } from "~/shared/forms/loaders";
export { useFormRaffleAction } from "~/shared/forms/actions";

export default component$(() => {
  const session = useSession();
  return (
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-50 py-6">
      <div class="w-full max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row lg:items-start lg:gap-6">
        {!session.value && (
          <div class="w-full lg:w-[400px] lg:sticky lg:top-6">
            <InfoAlert />
          </div>
        )}
        
        <Card.Root class="w-full max-w-[550px] mx-auto lg:mx-0 animate-fadeIn">
          <Card.Header>
            <Card.Title>Create New Raffle</Card.Title>
            <Card.Description>Enter the information for your raffle</Card.Description>
          </Card.Header>
          <Card.Content>
            {!session.value ? (
              <GuestRaffleForm />
            ) : session.value.user?.name === "isPremium" ? (
              <PremiumRaffleForm />
            ) : (
              <BasicRaffleForm />
            )}
          </Card.Content>
        </Card.Root>
      </div>
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
