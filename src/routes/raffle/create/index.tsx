import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Card } from "~/components/ui";
import { useServerSession } from "~/shared/loaders";
import { _ } from "compiled-i18n";

import GuestRaffleForm from "~/components/forms/GuestRaffleForm";
import BasicRaffleForm from "~/components/forms/BasicRaffleForm";
import PremiumRaffleForm from "~/components/forms/PremiumRaffleForm";
import { LuInfo, LuAlertTriangle } from "@qwikest/icons/lucide";

export { useFormRaffleLoader } from "~/shared/forms/loaders";
export { useFormRaffleAction } from "~/shared/forms/actions";

export const PremiumInfoAlert = () => (
  <div class="rounded-lg border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
    <h3 class="text-xl font-semibold mb-4 flex items-center text-primary">
      <span class="bg-primary/10 p-2 rounded-full mr-2">✨</span>
      {_`Premium Benefits`}
    </h3>
    <ul class="space-y-3 text-sm text-muted-foreground">
      <li class="flex items-start">
        <span class="text-primary mr-2 font-bold">•</span> 
        <span><strong>{_`Unlimited`}</strong> {_`active raffles simultaneously`}</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary mr-2 font-bold">•</span> 
        <span><strong>{_`Up to 10,000`}</strong> {_`numbers per raffle`}</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary mr-2 font-bold">•</span> 
        <span>{_`Payment integration for easy collection`}</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary mr-2 font-bold">•</span> 
        <span>{_`Advanced customization options`}</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary mr-2 font-bold">•</span> 
        <span>{_`Detailed statistics and analytics`}</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary mr-2 font-bold">•</span> 
        <span>{_`Priority customer support`}</span>
      </li>
    </ul>
  </div>
);

export const BasicInfoAlert = () => (
  <div class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
    <h3 class="text-xl font-semibold mb-4 flex items-center">
      <span class="bg-primary/10 p-2 rounded-full mr-2">✨</span>
      {_`Basic Account Features`}
    </h3>
    <ul class="space-y-3 text-sm text-muted-foreground">
      <li class="flex items-start">
        <span class="text-primary mr-2 font-bold">•</span> 
        <span><strong>{_`1`}</strong> {_`active raffle at a time`}</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary mr-2 font-bold">•</span> 
        <span><strong>{_`Up to 1,000`}</strong> {_`numbers per raffle`}</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary mr-2 font-bold">•</span> 
        <span>{_`Basic customization options`}</span>
      </li>
      <li class="flex items-start">
        <span class="text-primary mr-2 font-bold">•</span> 
        <span>{_`Standard support`}</span>
      </li>
      <li class="flex items-start mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <a href="/app/premium" class="text-primary hover:underline font-medium flex items-center">
          {_`Upgrade to Premium`} 
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </li>
    </ul>
  </div>
);

export const ActiveRaffleAlert = component$(() => {
  return (
    <div class="w-full mb-4 lg:mb-0 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
      <div class="flex items-start">
        <div class="flex-shrink-0 mt-0.5">
          <LuAlertTriangle class="w-5 h-5 text-amber-500 dark:text-amber-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-amber-800 dark:text-amber-300">{_`You have an active raffle`}</h3>
          <div class="mt-2 text-sm text-amber-700 dark:text-amber-400">
            <p>{_`As a free user, you can only have one active raffle at a time.`}</p>
            <p class="mt-1">{_`To create a new raffle, you can either:`}</p>
            <ul class="mt-2 list-disc pl-5 space-y-1">
              <li>{_`Wait for your current raffle to expire`}</li>
              <li>{_`Manually end your current active raffle`}</li>
              <li><strong>{_`Upgrade to Premium`}</strong> {_`for unlimited raffles`}</li>
            </ul>
          </div>
          <div class="mt-4 flex gap-3">
            <a href="/users/me" class="inline-flex items-center px-4 py-2 border border-amber-300 dark:border-amber-700 text-sm font-medium rounded-md text-amber-800 dark:text-amber-300 bg-transparent hover:bg-amber-100 dark:hover:bg-amber-800/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
              {_`View My Raffles`}
            </a>
            <a href="/app/premium" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              {_`Upgrade to Premium`}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

export const InfoAlert = component$(() => {
  return (
      <div class="w-full mb-4 lg:mb-0 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="flex items-start">
              <div class="flex-shrink-0 mt-0.5">
                  <LuInfo class="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">{_`Important information about your raffle`}</h3>
                  <ul class="mt-2 text-sm text-blue-700 dark:text-blue-400 list-disc pl-5 space-y-1">
                      <li>{_`This raffle will be saved locally in your browser using IndexedDB.`}</li>
                      <li>{_`You can only access it from this same device and browser.`}</li>
                      <li>{_`If you delete your browser data, change devices, or use a different browser,`} <strong>{_`you will lose the raffle data`}</strong>.</li>
                      <li>{_`To save raffles on multiple devices and browsers,`} <strong>{_`register for free`}</strong> {_`to unlock additional features.`}</li>
                      <li>{_`Registered users can create raffles with up to 1,000 tickets (the guest limit is 100).`}</li>
                      <li>{_`The application is not responsible for any loss of locally saved raffle data.`}</li>
                  </ul>
                  <div class="mt-4">
                      <a href="/register" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                          {_`Register for Free`}
                      </a>
                  </div>
              </div>
          </div>
      </div>
  );
});

export default component$(() => {
  const session = useServerSession();
  
  return (
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div class="w-full max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row lg:items-start lg:gap-8">
        <div class="w-full lg:w-[350px] xl:w-[400px] mb-6 lg:mb-0 lg:sticky lg:top-6">
          {!session.value.session ? (
            <InfoAlert />
          ) : session.value.isPremium === true ? (
            <PremiumInfoAlert />
          ) : session.value.hasActiveRaffle ? (
            <ActiveRaffleAlert />
          ) : (
            <BasicInfoAlert />
          )}
        </div>
        
        <Card.Root class="w-full flex-1 max-w-[650px] mx-auto lg:mx-0 animate-fadeIn">
          {!session.value.hasActiveRaffle && (
            <Card.Header>
              <Card.Title>{_`Create New Raffle`}</Card.Title>
              <Card.Description>{_`Enter the information for your raffle`}</Card.Description>
            </Card.Header>
)}
          <Card.Content>
            {!session.value.session ? (
              <GuestRaffleForm />
            ) : session.value.isPremium === true ? (
              <PremiumRaffleForm />
            ) : session.value.hasActiveRaffle ? (
              <div class="py-6 text-center">
                <LuAlertTriangle class="w-12 h-12 mx-auto text-amber-500" />
                <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{_`Unable to create a new raffle`}</h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{_`You already have an active raffle. Free users can only have one active raffle at a time.`}</p>
                <div class="mt-6 flex justify-center gap-3">
                  <a href="/users/me" class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    {_`Manage Raffles`}
                  </a>
                  <a href="/app/premium" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    {_`Upgrade to Premium`}
                  </a>
                </div>
              </div>
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
  title: _`Qwik Raffle - Create Raffle`,
  meta: [
    {
      name: "description",
      content: _`Create a new raffle quickly with Qwik Raffle`,
    },
  ],
};
