import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Card } from "~/components/ui";
import { useSession } from "~/routes/plugin@auth";

import GuestRaffleForm, { InfoAlert } from "~/components/forms/GuestRaffleForm";
import BasicRaffleForm from "~/components/forms/BasicRaffleForm";
import PremiumRaffleForm from "~/components/forms/PremiumRaffleForm";

export { useFormRaffleLoader } from "~/shared/forms/loaders";
export { useFormRaffleAction } from "~/shared/forms/actions";

export const PremiumInfoAlert = () => (
  <div class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
    <h3 class="font-semibold mb-2">Premium Benefits</h3>
    <ul class="space-y-2 text-sm text-muted-foreground">
      <li>✨ Unlimited raffles</li>
      <li>✨ Up to 10,000 participants per raffle</li>
      <li>✨ Payment integration</li>
      <li>✨ Detailed statistics</li>
      <li>✨ Priority support</li>
    </ul>
  </div>
);

export const BasicInfoAlert = () => (
  <div class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
    <h3 class="font-semibold mb-2">Basic Account Features</h3>
    <ul class="space-y-2 text-sm text-muted-foreground">
      <li>✨ 1 saved raffle</li>
      <li>✨ Up to 1,000 participants</li>
      <li>✨ Basic customization</li>
      <li>✨ <a href="/app/premium" class="text-primary hover:underline">Upgrade to Premium</a> for more features!</li>
    </ul>
  </div>
);

export default component$(() => {
  const session = useSession();
  
  return (
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-50 py-6">
      <div class="w-full max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row lg:items-start lg:gap-6">
        <div class="w-full lg:w-[400px] lg:sticky lg:top-6">
          {!session.value ? (
            <InfoAlert />
          ) : session.value.user?.name === "isPremium" ? (
            <PremiumInfoAlert />
          ) : (
            <BasicInfoAlert />
          )}
        </div>
        
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
