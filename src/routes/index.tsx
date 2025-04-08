import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { Modal } from '@qwik-ui/headless';
import { LuFacebook, LuTwitter, LuInstagram, LuCheck, LuPlay, LuGift, LuShare, LuClock, LuSettings, LuStar, LuTrophy, LuShield, LuX, LuHelpCircle } from '@qwikest/icons/lucide';
import SocialLoginButtons from '~/components/SocialLoginButtons';
import { Accordion } from '~/components/ui';
import { _ } from 'compiled-i18n';

export default component$(() => {
  const showLoginModal = useSignal(false);
  return (
    <>
      <div class="min-h-screen flex flex-col bg-background text-foreground">
        <main class="flex-grow">
          {/* Hero Section */}
          <section class="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted relative overflow-hidden">
            <div class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,0.8))] dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.4))]"></div>
            <div class="container mx-auto px-4 md:px-6 relative">
              <div class="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div class="space-y-6">
                  <div class="inline-flex items-center rounded-full border-2 border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm animate-fadeIn">
                    <LuStar class="mr-2 h-4 w-4 text-primary text-yellow-500 fill-current" />
                    <span>{_`The easiest way to organize online raffles`}</span>
                  </div>
                  <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent animate-fadeIn">
                    {_`Create Online Raffles in Seconds`}
                  </h1>
                  <p class="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                    {_`Easy, fast, and customizable. Ideal for events, promotions, and much more.`}
                  </p>
                  <div class="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/raffle/create"
                      class="inline-flex h-12 items-center justify-center rounded-base bg-primary px-8 text-base font-medium text-white shadow-md transition-all hover:bg-primary-hover hover:shadow-lg press"
                    >
                      {_`Create a Raffle Now`}
                    </Link>
                    <Link
                      href="#features"
                      class="inline-flex h-12 items-center justify-center rounded-base border border-primary px-8 text-base font-medium text-primary shadow-sm transition-all hover:bg-primary/10 press"
                    >
                      {_`Discover Features`}
                    </Link>
                  </div>
                </div>
                <div class="flex justify-center">
                  <div class="relative w-full max-w-md overflow-hidden rounded-xl border bg-card shadow-xl transition-all hover:shadow-2xl">
                    <div class="aspect-video w-full bg-muted relative">
                      {/* Placeholder for video or image */}
                      <div class="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <div class="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg hover:bg-primary transition-colors cursor-pointer">
                          <LuPlay class="h-6 w-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <div class="p-6 text-center bg-card">
                      <p class="text-sm font-medium text-primary">{_`See how it works`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" class="w-full py-16 md:py-24 lg:py-32 bg-card">
            <div class="container mx-auto px-4 md:px-6">
              <div class="flex flex-col items-center justify-center space-y-4 text-center">
                <div class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                  <LuStar class="mr-2 h-4 w-4 text-primary text-yellow-500 fill-current" />
                  <span>{_`Loaded with features`}</span>
                </div>
                <div class="space-y-3 max-w-3xl">
                  <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                    {_`Featured Features`}
                  </h2>
                  <p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {_`Everything you need to create and manage your online raffles`}
                  </p>
                </div>
              </div>
              <div class="mx-auto grid max-w-5xl items-center gap-8 py-12 md:grid-cols-2 lg:grid-cols-4 text-center">
                {/* Feature 1 */}
                <div class="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 bg-card">
                  <div class="rounded-full bg-primary/10 p-4">
                    <LuClock class="h-10 w-10 text-primary" />
                  </div>
                  <h3 class="text-xl font-bold">{_`Create raffles in seconds`}</h3>
                  <p class="text-sm text-muted-foreground text-center">
                    {_`Set up your raffle quickly with our intuitive interface`}
                  </p>
                </div>

                {/* Feature 2 */}
                <div class="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 bg-card">
                  <div class="rounded-full bg-primary/10 p-4">
                    <LuShare class="h-10 w-10 text-primary" />
                  </div>
                  <h3 class="text-xl font-bold">{_`Share with a unique link`}</h3>
                  <p class="text-sm text-muted-foreground text-center">
                    {_`Easily distribute your raffle on social networks or by email`}
                  </p>
                </div>

                {/* Feature 3 */}
                <div class="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 bg-card">
                  <div class="rounded-full bg-primary/10 p-4">
                    <LuTrophy class="h-10 w-10 text-primary" />
                  </div>
                  <h3 class="text-xl font-bold">{_`Automatic results`}</h3>
                  <p class="text-sm text-muted-foreground text-center">
                    {_`Get random winners with total transparency and confidence`}
                  </p>
                </div>

                {/* Feature 4 */}
                <div class="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 bg-card">
                  <div class="rounded-full bg-primary/10 p-4">
                    <LuSettings class="h-10 w-10 text-primary" />
                  </div>
                  <h3 class="text-xl font-bold">{_`Customize your rules`}</h3>
                  <p class="text-sm text-muted-foreground text-center">
                    {_`Adapt each raffle to your specific needs`}
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Pricing Comparison Table */}
          <section id="pricing" class="w-full py-16 md:py-24 lg:py-32 bg-muted">
            <div class="container mx-auto px-4 md:px-6">
              <div class="flex flex-col items-center justify-center space-y-4 text-center">
                <div class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                  <LuShield class="mr-1 h-3.5 w-3.5" />
                  <span>{_`Flexible plans`}</span>
                </div>
                <div class="space-y-3 max-w-3xl">
                  <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                    {_`Plans for every need`}
                  </h2>
                  <p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {_`Choose the plan that best suits your needs`}
                  </p>
                </div>
              </div>

              <div class="mx-auto grid max-w-4xl gap-6 py-12 lg:grid-cols-3">
                {/* Plan Básico */}
                <div id="plan-basico" class="flex flex-col rounded-xl border bg-card shadow-sm hover:shadow-md transition-all h-full">
                  <div class="p-6 flex flex-col h-full">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-2xl font-bold">{_`Basic`}</h3>
                      <span class="inline-flex items-center rounded-full border border-muted-foreground/30 bg-muted-foreground/10 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        {_`Basic`}
                      </span>
                    </div>
                    <div class="mt-4 text-center">
                      <div class="text-4xl font-bold">{_`Free`}</div>
                      <p class="text-sm text-muted-foreground mt-1">{_`Ideal for quick tests and small raffles`}</p>
                    </div>
                    <ul class="mt-6 space-y-3 flex-grow">
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Storage`}: <span class="font-medium">{_`Local (Browser)`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Ticket limit`}: <span class="font-medium">{_`Up to 100`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Active raffles`}: <span class="font-medium">{_`1 at a time`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuX class="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span class="text-muted-foreground">{_`Customization`}</span>
                      </li>
                      <li class="flex items-start">
                        <LuX class="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span class="text-muted-foreground">{_`Detailed statistics`}</span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Support`}: <span class="font-medium">{_`Community`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuX class="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span class="text-muted-foreground">{_`No ads`}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="p-6 pt-0 mt-4">
                    <Link
                      href="/raffle/create"
                      class="inline-flex h-10 w-full items-center justify-center rounded-base border border-primary bg-card px-8 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/10 hover:text-primary press"
                    >
                      {_`Get Started`}
                    </Link>
                  </div>
                </div>

                {/* Plan Gratis */}
                <div id="plan-gratis" class="flex flex-col rounded-xl border bg-card shadow-sm hover:shadow-md transition-all h-full">
                  <div class="p-6 flex flex-col h-full">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-2xl font-bold">{_`Free`}</h3>
                      <span class="inline-flex items-center rounded-full border border-muted-foreground/30 bg-muted-foreground/10 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        {_`Popular`}
                      </span>
                    </div>
                    <div class="mt-4 text-center">
                      <div class="text-4xl font-bold">{_`Free`}</div>
                      <p class="text-sm text-muted-foreground mt-1">{_`Perfect for registered users with standard needs`}</p>
                    </div>
                    <ul class="mt-6 space-y-3 flex-grow">
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Storage`}: <span class="font-medium">{_`Cloud`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Ticket limit`}: <span class="font-medium">{_`Up to 1,000`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Active raffles`}: <span class="font-medium">{_`1 at a time`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuX class="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span class="text-muted-foreground">{_`Customization`}</span>
                      </li>
                      <li class="flex items-start">
                        <LuX class="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span class="text-muted-foreground">{_`Detailed statistics`}</span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Support`}: <span class="font-medium">{_`Standard`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuX class="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span class="text-muted-foreground">{_`No ads`}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="p-6 pt-0 mt-4">
                    <Link
                      class="inline-flex h-10 w-full items-center justify-center rounded-base border border-primary bg-card px-8 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/10 press"
                      href="/signup"
                    >
                      {_`Register for Free`}
                    </Link>
                  </div>
                </div>

                {/* Plan Premium */}
                <div id="plan-premium" class="flex flex-col rounded-xl border-2 border-primary bg-card shadow-lg hover:shadow-xl scale-[1.02] transition-all h-full">
                  <div class="bg-primary/10 py-2 px-6 rounded-t-xl">
                    <div class="text-center text-primary font-semibold">{_`Recommended`}</div>
                  </div>
                  <div class="p-6 flex flex-col h-full">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-2xl font-bold">{_`Premium`}</h3>
                      <span class="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {_`Complete`}
                      </span>
                    </div>
                    <div class="mt-4 text-center">
                      <div class="text-4xl font-bold">$ 4900 ARS<span class="text-base font-normal">/{_`month`}</span></div>
                      <p class="text-sm text-muted-foreground mt-1">{_`For advanced users, businesses and multiple raffles`}</p>
                    </div>
                    <ul class="mt-6 space-y-3 flex-grow">
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Storage`}: <span class="font-medium">{_`Cloud`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Ticket limit`}: <span class="font-medium">{_`Up to 10,000`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Active raffles`}: <span class="font-medium">{_`Unlimited`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Advanced customization`}</span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Detailed statistics & analytics`}</span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`Support`}: <span class="font-medium">{_`Priority`}</span></span>
                      </li>
                      <li class="flex items-start">
                        <LuCheck class="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{_`No ads`}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="p-6 pt-0 mt-4">
                    <Link
                      href="/app/premium"
                      class="inline-flex h-10 w-full items-center justify-center rounded-base bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary-hover press"
                    >
                      {_`Get Premium`}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" class="w-full py-16 md:py-24 lg:py-32 bg-card">
            <div class="container mx-auto px-4 md:px-6">
              <div class="flex flex-col items-center justify-center space-y-4 text-center">
                <div class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                  <LuStar class="mr-2 h-5 w-5 text-primary text-yellow-500 fill-current" />
                  <span>{_`Real opinions`}</span>
                </div>
                <div class="space-y-3 max-w-3xl">
                  <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                    {_`What our users say`}
                  </h2>
                  <p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {_`Discover why our users trust us for their raffles`}
                  </p>
                </div>
              </div>
              <div class="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                {/* Testimonial 1 */}
                <div class="flex flex-col rounded-xl border p-6 shadow-sm hover:shadow-md transition-all bg-card">
                  <div class="flex-1">
                    <div class="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <LuStar key={star} class="h-5 w-5 text-primary text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p class="text-foreground italic">
                      "{_`Incredibly easy to use! I organized a raffle for my online store in minutes.`}"
                    </p>
                  </div>
                  <div class="mt-6 pt-6 border-t border-border">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary/60 to-primary-hover/60 flex items-center justify-center text-white font-semibold">DL</div>
                      <div class="ml-3">
                        <p class="font-medium">Daiana Lentz</p>
                        <p class="text-sm text-muted-foreground">{_`Consultant`}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div class="flex flex-col rounded-xl border p-6 shadow-sm hover:shadow-md transition-all bg-card">
                  <div class="flex-1">
                    <div class="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <LuStar key={star} class="h-5 w-5 text-primary text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p class="text-foreground italic">
                      "{_`Perfect for my events. The ability to customize the rules has saved me a lot of time.`}"
                    </p>
                  </div>
                  <div class="mt-6 pt-6 border-t border-border">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary/60 to-primary-hover/60 flex items-center justify-center text-white font-semibold">MG</div>
                      <div class="ml-3">
                        <p class="font-medium">María G.</p>
                        <p class="text-sm text-muted-foreground">{_`Event Organizer`}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div class="flex flex-col rounded-xl border p-6 shadow-sm hover:shadow-md transition-all bg-card">
                  <div class="flex-1">
                    <div class="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <LuStar key={star} class="h-5 w-5 text-primary text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p class="text-foreground italic">
                      "{_`The statistics of the Premium plan have helped me better understand my audience. Totally recommended.`}"
                    </p>
                  </div>
                  <div class="mt-6 pt-6 border-t border-border">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary/60 to-primary-hover/60 flex items-center justify-center text-white font-semibold">CM</div>
                      <div class="ml-3">
                        <p class="font-medium">Carlos M.</p>
                        <p class="text-sm text-muted-foreground">{_`Influencer`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" class="w-full py-16 md:py-24 lg:py-32 bg-muted">
            <div class="container mx-auto px-4 md:px-6">
              <div class="flex flex-col items-center justify-center space-y-4 text-center">
                <div class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                  <LuHelpCircle class="mr-2 h-5 w-5 text-primary" />
                  <span>{_`Frequently Asked Questions`}</span>
                </div>
                <div class="space-y-3 max-w-3xl">
                  <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                    {_`Common Questions`}
                  </h2>
                  <p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {_`Find answers to the most frequently asked questions about our raffle platform`}
                  </p>
                </div>
              </div>
              
              <div class="mx-auto max-w-3xl mt-12">
                <Accordion.Root class="w-full">
                  <Accordion.Item>
                    <Accordion.Trigger header="h3">{_`How do I create a raffle without an account?`}</Accordion.Trigger>
                    <Accordion.Content>
                      {_`create_raffle_instructions`}
                    </Accordion.Content>
                  </Accordion.Item>
                  
                  <Accordion.Item>
                    <Accordion.Trigger header="h3">{_`What are the benefits of registering for a free account?`}</Accordion.Trigger>
                    <Accordion.Content>
                      {_`With a free registered account, your raffles are stored in our database, allowing you to access them from any device. You can create one raffle at a time with up to 1,000 tickets per raffle. Your data is securely saved, and you can track the status of your raffle over time.`}
                    </Accordion.Content>
                  </Accordion.Item>
                  
                  <Accordion.Item>
                    <Accordion.Trigger header="h3">{_`What features are included in the Premium plan?`}</Accordion.Trigger>
                    <Accordion.Content>
                      {_`Our Premium plan offers multiple simultaneous raffles with up to 10,000 tickets per raffle. Premium users also get ad-free experience, detailed statistics on participation, customization options for colors and styles, payment integration, and priority support. It's perfect for businesses, influencers, or frequent raffle organizers.`}
                    </Accordion.Content>
                  </Accordion.Item>
                  
                  <Accordion.Item>
                    <Accordion.Trigger header="h3">{_`How is the winner selection process conducted?`}</Accordion.Trigger>
                    <Accordion.Content>
                      {_`Our platform uses a cryptographically secure random number generator to ensure fair and unbiased selection of winners. The selection process is transparent and cannot be manipulated. Results are generated instantly and shown to all participants, ensuring trust in your raffle.`}
                    </Accordion.Content>
                  </Accordion.Item>
                  
                  <Accordion.Item>
                    <Accordion.Trigger header="h3">{_`Can I customize the appearance of my raffle?`}</Accordion.Trigger>
                    <Accordion.Content>
                      {_`Yes, customization options depend on your account type. Free registered users get basic customization such as adding a title, description, and logo. Premium users can fully customize colors, fonts, backgrounds, and even add custom CSS for a completely personalized look that matches their brand identity.`}
                    </Accordion.Content>
                  </Accordion.Item>
                  
                  <Accordion.Item>
                    <Accordion.Trigger header="h3">{_`How long are raffles stored in the system?`}</Accordion.Trigger>
                    <Accordion.Content>
                      {_`For users without an account, raffles are stored in your browser's local storage for up to 30 days. Free registered accounts can store one active raffle indefinitely until deleted. Premium accounts can store unlimited raffles with no time limitation, including historical data for analytics purposes.`}
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section class="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
            <div class="container mx-auto px-4 md:px-6">
              <div class="flex flex-col items-center justify-center space-y-6 text-center">
                <div class="space-y-3 max-w-3xl">
                  <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                    {_`Ready to start?`}
                  </h2>
                  <p class="max-w-[700px] text-white/90 md:text-xl/relaxed">
                    {_`Create your first raffle now and discover how easy it is`}
                  </p>
                </div>
                <div class="mx-auto flex flex-col items-center justify-center sm:flex-row gap-4 max-w-md w-full">
                  <Link
                    href="/raffle/create"
                    class="inline-flex h-12 items-center justify-center rounded-base bg-white px-8 text-base font-medium text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl press"
                  >
                    {_`Create a Free Raffle`}
                  </Link>
                  <Link
                    href="/app/register"
                    class="inline-flex h-12 items-center justify-center rounded-base bg-transparent border border-white px-8 text-base font-medium text-white shadow transition-all hover:bg-white/10 press"
                  >
                    {_`Register`}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer class="w-full border-t py-12 bg-background">
          <div class="container mx-auto px-4 md:px-6">
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div class="space-y-4">
                <div class="flex items-center">
                  <LuGift class="h-6 w-6 text-primary" />
                  <span class="ml-2 text-lg font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">QwikRaffle</span>
                </div>
                <p class="text-sm text-muted-foreground">
                  {_`The easiest platform to create and manage online raffles.`}
                </p>
                <div class="flex space-x-4">
                  <Link href="https://twitter.com" class="text-muted-foreground hover:text-primary transition-colors">
                    <LuTwitter class="h-5 w-5" />
                    <span class="sr-only">Twitter</span>
                  </Link>
                  <Link href="https://facebook.com" class="text-muted-foreground hover:text-primary transition-colors">
                    <LuFacebook class="h-5 w-5" />
                    <span class="sr-only">Facebook</span>
                  </Link>
                  <Link href="https://instagram.com" class="text-muted-foreground hover:text-primary transition-colors">
                    <LuInstagram class="h-5 w-5" />
                    <span class="sr-only">Instagram</span>
                  </Link>
                </div>
              </div>

              <div>
                <h3 class="mb-4 text-lg font-medium">Links</h3>
                <nav class="flex flex-col space-y-3">
                  <Link href="/about" class="text-sm text-muted-foreground hover:text-primary transition-colors">{_`About`}</Link>
                  <Link href="/blog" class="text-sm text-muted-foreground hover:text-primary transition-colors">{_`Blog`}</Link>
                  <Link href="/contact" class="text-sm text-muted-foreground hover:text-primary transition-colors">{_`Contact`}</Link>
                </nav>
              </div>

              <div>
                <h3 class="mb-4 text-lg font-medium">{_`Legal`}</h3>
                <nav class="flex flex-col space-y-3">
                  <Link href="/terms" class="text-sm text-muted-foreground hover:text-primary transition-colors">{_`Terms of Use`}</Link>
                  <Link href="/privacy" class="text-sm text-muted-foreground hover:text-primary transition-colors">{_`Privacy Policy`}</Link>
                  <Link href="/cookies" class="text-sm text-muted-foreground hover:text-primary transition-colors">{_`Cookies Policy`}</Link>
                </nav>
              </div>

              <div>
                <h3 class="mb-4 text-lg font-medium">{_`Support`}</h3>
                <nav class="flex flex-col space-y-3">
                  <Link href="/help" class="text-sm text-muted-foreground hover:text-primary transition-colors">{_`Help Center`}</Link>
                  <Link href="#faq" class="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
                  <Link href="/contact" class="text-sm text-muted-foreground hover:text-primary transition-colors">{_`Contact Support`}</Link>
                </nav>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <div class="flex items-center space-x-4">
        <Modal.Root bind:show={showLoginModal}>
          <Modal.Panel class="p-8">
            <div class="flex items-center justify-between">
              <Modal.Title>{_`Login`}</Modal.Title>
              <Modal.Close class="hover:scale-110 transition-transform duration-200">
                <LuX class="h-5 w-5" />
              </Modal.Close>
            </div>
            <Modal.Description class="mb-4">{_`Login to your account`}</Modal.Description>
            <SocialLoginButtons />
          </Modal.Panel>
        </Modal.Root>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'QwikRaffle - Create Online Raffles in Minutes',
  meta: [
    {
      name: 'description',
      content: 'Easy, fast, and customizable. Ideal for events, promotions, and much more.',
    },
  ],
};