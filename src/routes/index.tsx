import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { Modal } from '@qwik-ui/headless';
import { LuFacebook, LuTwitter, LuInstagram, LuCheck, LuPlay, LuGift, LuShare, LuClock, LuSettings, LuStar, LuTrophy, LuUserPlus, LuShield, LuX } from '@qwikest/icons/lucide';
import { Image } from "@unpic/qwik";
import SocialLoginButtons from '~/components/SocialLoginButtons';
import { Button } from '~/components/ui';

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
                    <span>The easiest way to organize online raffles</span>
                  </div>
                  <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent animate-fadeIn">
                    Create Online Raffles in Minutes
                  </h1>
                  <p class="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                    Easy, fast, and customizable. Ideal for events, promotions, and much more.
                  </p>
                  <div class="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/create"
                      class="inline-flex h-12 items-center justify-center rounded-base bg-primary px-8 text-base font-medium text-white shadow-md transition-all hover:bg-primary-hover hover:shadow-lg press"
                    >
                      Create a Raffle Now
                    </Link>
                    <Link
                      href="#features"
                      class="inline-flex h-12 items-center justify-center rounded-base border border-primary px-8 text-base font-medium text-primary shadow-sm transition-all hover:bg-primary/10 press"
                    >
                      Discover Features
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
                      <p class="text-sm font-medium text-primary">See how it works</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Banner */}
              <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div class="rounded-xl border bg-card p-4 shadow-sm">
                  <div class="text-3xl font-bold text-primary">+10K</div>
                  <p class="text-sm text-muted-foreground">Raffles created</p>
                </div>
                <div class="rounded-xl border bg-card p-4 shadow-sm">
                  <div class="text-3xl font-bold text-primary">+50K</div>
                  <p class="text-sm text-muted-foreground">Happy participants</p>
                </div>
                <div class="rounded-xl border bg-card p-4 shadow-sm">
                  <div class="text-3xl font-bold text-primary">99%</div>
                  <p class="text-sm text-muted-foreground">Satisfaction</p>
                </div>
                <div class="rounded-xl border bg-card p-4 shadow-sm">
                  <div class="text-3xl font-bold text-primary">24/7</div>
                  <p class="text-sm text-muted-foreground">Support available</p>
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
                  <span>Loaded with features</span>
                </div>
                <div class="space-y-3 max-w-3xl">
                  <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                    Featured Features
                  </h2>
                  <p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Everything you need to create and manage your online raffles
                  </p>
                </div>
              </div>
              <div class="mx-auto grid max-w-5xl items-center gap-8 py-12 md:grid-cols-2 lg:grid-cols-4 text-center">
                {/* Feature 1 */}
                <div class="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 bg-card">
                  <div class="rounded-full bg-primary/10 p-4">
                    <LuClock class="h-10 w-10 text-primary" />
                  </div>
                  <h3 class="text-xl font-bold">Create raffles in seconds</h3>
                  <p class="text-sm text-muted-foreground text-center">
                    Set up your raffle quickly with our intuitive interface
                  </p>
                </div>

                {/* Feature 2 */}
                <div class="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 bg-card">
                  <div class="rounded-full bg-primary/10 p-4">
                    <LuShare class="h-10 w-10 text-primary" />
                  </div>
                  <h3 class="text-xl font-bold">Share with a unique link</h3>
                  <p class="text-sm text-muted-foreground text-center">
                    Easily distribute your raffle on social networks or by email
                  </p>
                </div>

                {/* Feature 3 */}
                <div class="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 bg-card">
                  <div class="rounded-full bg-primary/10 p-4">
                    <LuTrophy class="h-10 w-10 text-primary" />
                  </div>
                  <h3 class="text-xl font-bold">Automatic results</h3>
                  <p class="text-sm text-muted-foreground text-center">
                    Get random winners with total transparency and confidence
                  </p>
                </div>

                {/* Feature 4 */}
                <div class="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 bg-card">
                  <div class="rounded-full bg-primary/10 p-4">
                    <LuSettings class="h-10 w-10 text-primary" />
                  </div>
                  <h3 class="text-xl font-bold">Customize your rules</h3>
                  <p class="text-sm text-muted-foreground text-center">
                    Adapt each raffle to your specific needs
                  </p>
                </div>
              </div>

              {/* Feature highlight */}
              <div class="mt-12 rounded-xl border bg-card overflow-hidden shadow-lg">
                <div class="grid md:grid-cols-2">
                  <div class="p-8 md:p-12 flex flex-col justify-center space-y-4">
                    <div class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary w-fit">
                      <LuUserPlus class="mr-1 h-3.5 w-3.5" />
                      <span>Easy participation</span>
                    </div>
                    <h3 class="text-2xl md:text-3xl font-bold">Simple experience for participants</h3>
                    <p class="text-muted-foreground">
                      We allow your participants to join raffles in seconds, without complex registrations or long processes.
                    </p>
                    <ul class="space-y-2">
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Intuitive and friendly interface</span>
                      </li>
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Support for multiple devices</span>
                      </li>
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Real-time notifications</span>
                      </li>
                    </ul>
                  </div>
                  <div class="bg-gradient-to-br from-primary/20 to-primary-hover/20 flex items-center justify-center p-8">
                    <Image
                      src="https://placehold.co/600x400/0284c7/FFFFFF/png?text=Experiencia+de+Usuario&font=montserrat"
                      alt="User experience"
                      class="rounded-lg shadow-lg max-w-full h-auto"
                    />
                  </div>
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
                  <span>Flexible plans</span>
                </div>
                <div class="space-y-3 max-w-3xl">
                  <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                    Plans for every need
                  </h2>
                  <p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Choose the plan that best suits your needs
                  </p>
                </div>
              </div>

              <div class="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
                {/* Sin Sesión */}
                <div class="flex flex-col rounded-xl border bg-card shadow-sm hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-2xl font-bold">No Session</h3>
                      <span class="inline-flex items-center rounded-full border border-muted-foreground/30 bg-muted-foreground/10 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        Basic
                      </span>
                    </div>
                    <div class="mt-4 text-center">
                      <div class="text-4xl font-bold">Free</div>
                      <p class="text-sm text-muted-foreground mt-1">No commitments</p>
                    </div>
                    <ul class="mt-6 space-y-3">
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Temporary raffles</span>
                      </li>
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Limit of 100 participants</span>
                      </li>
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Immediate results</span>
                      </li>
                    </ul>
                  </div>
                  <div class="mt-auto p-6 pt-0">
                    <Link
                      href="/create"
                      class="inline-flex h-10 w-full items-center justify-center rounded-base border border-primary bg-card px-8 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/10 hover:text-primary press"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>

                {/* Registrado (Gratis) */}
                <div class="flex flex-col rounded-xl border bg-card shadow-sm hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-2xl font-bold">Registered</h3>
                      <span class="inline-flex items-center rounded-full border border-muted-foreground/30 bg-muted-foreground/10 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        Popular
                      </span>
                    </div>
                    <div class="mt-4 text-center">
                      <div class="text-4xl font-bold">Free</div>
                      <p class="text-sm text-muted-foreground mt-1">With user account</p>
                    </div>
                    <ul class="mt-6 space-y-3">
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>1 saved raffle</span>
                      </li>
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Limit of 1000 participants</span>
                      </li>
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Basic customization</span>
                      </li>
                    </ul>
                  </div>
                  <div17 class="mt-auto p-6 pt-0">
                    <Button
                      class="inline-flex h-10 w-full items-center justify-center rounded-base border border-primary bg-card px-8 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/10 press"
                      onClick$={() => showLoginModal.value = true}
                    >
                      Register for Free
                    </Button>
                  </div17>
                </div>

                {/* Premium */}
                <div class="flex flex-col rounded-xl border-2 border-primary bg-card shadow-lg hover:shadow-xl scale-[1.02] transition-all">
                  <div class="bg-primary/10 py-2 px-6 rounded-t-xl">
                    <div class="text-center text-primary font-semibold">Recommended</div>
                  </div>
                  <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-2xl font-bold">Premium</h3>
                      <span class="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        Complete
                      </span>
                    </div>
                    <div class="mt-4 text-center">
                      <div class="text-4xl font-bold">$ 4900<span class="text-base font-normal">/month</span></div>
                      <p class="text-sm text-muted-foreground mt-1">Monthly billing</p>
                    </div>
                    <ul class="mt-6 space-y-3">
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Unlimited raffles</span>
                      </li>
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Limit of 10,000 participants per raffle</span>
                      </li>
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Payment integration</span>
                      </li>
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Detailed statistics</span>
                      </li>
                      <li class="flex items-center">
                        <LuCheck class="mr-2 h-5 w-5 text-primary" />
                        <span>Priority support</span>
                      </li>
                    </ul>
                  </div>
                  <div class="mt-auto p-6 pt-0">
                    <Link
                      href="/app/premium"
                      class="inline-flex h-10 w-full items-center justify-center rounded-base bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary-hover press"
                    >
                      Get Premium
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
                  <span>Real opinions</span>
                </div>
                <div class="space-y-3 max-w-3xl">
                  <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                    What our users say
                  </h2>
                  <p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Discover why our users trust us for their raffles
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
                      "Incredibly easy to use! I organized a raffle for my online store in minutes."
                    </p>
                  </div>
                  <div class="mt-6 pt-6 border-t border-border">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary/60 to-primary-hover/60 flex items-center justify-center text-white font-semibold">JP</div>
                      <div class="ml-3">
                        <p class="font-medium">Daiana Lentz.</p>
                        <p class="text-sm text-muted-foreground">Consultora</p>
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
                      "Perfect for my events. The ability to customize the rules has saved me a lot of time."
                    </p>
                  </div>
                  <div class="mt-6 pt-6 border-t border-border">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary/60 to-primary-hover/60 flex items-center justify-center text-white font-semibold">MG</div>
                      <div class="ml-3">
                        <p class="font-medium">María G.</p>
                        <p class="text-sm text-muted-foreground">Event Organizer</p>
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
                      "The statistics of the Premium plan have helped me better understand my audience. Totally recommended."
                    </p>
                  </div>
                  <div class="mt-6 pt-6 border-t border-border">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary/60 to-primary-hover/60 flex items-center justify-center text-white font-semibold">CM</div>
                      <div class="ml-3">
                        <p class="font-medium">Carlos M.</p>
                        <p class="text-sm text-muted-foreground">Influencer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section class="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
            <div class="container mx-auto px-4 md:px-6">
              <div class="flex flex-col items-center justify-center space-y-6 text-center">
                <div class="space-y-3 max-w-3xl">
                  <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                    Ready to start?
                  </h2>
                  <p class="max-w-[700px] text-white/90 md:text-xl/relaxed">
                    Create your first raffle now and discover how easy it is
                  </p>
                </div>
                <div class="mx-auto flex flex-col items-center justify-center sm:flex-row gap-4 max-w-md w-full">
                  <Link
                    href="/create"
                    class="inline-flex h-12 items-center justify-center rounded-base bg-white px-8 text-base font-medium text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl press"
                  >
                    Create a Free Raffle
                  </Link>
                  <Link
                    href="/app/register"
                    class="inline-flex h-12 items-center justify-center rounded-base bg-transparent border border-white px-8 text-base font-medium text-white shadow transition-all hover:bg-white/10 press"
                  >
                    Register
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
                  The easiest platform to create and manage online raffles.
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
                  <Link href="/about" class="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
                  <Link href="/blog" class="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
                  <Link href="/contact" class="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                </nav>
              </div>

              <div>
                <h3 class="mb-4 text-lg font-medium">Legal</h3>
                <nav class="flex flex-col space-y-3">
                  <Link href="/terms" class="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link>
                  <Link href="/privacy" class="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link href="/cookies" class="text-sm text-muted-foreground hover:text-primary transition-colors">Cookies Policy</Link>
                </nav>
              </div>

              <div>
                <h3 class="mb-4 text-lg font-medium">Support</h3>
                <nav class="flex flex-col space-y-3">
                  <Link href="/help" class="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</Link>
                  <Link href="/faq" class="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
                  <Link href="/contact" class="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Support</Link>
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
              <Modal.Title>Login</Modal.Title>
              <Modal.Close class="hover:scale-110 transition-transform duration-200">
                <LuX class="h-5 w-5" />
              </Modal.Close>
            </div>
            <Modal.Description class="mb-4">Login to your account</Modal.Description>
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