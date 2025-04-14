import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { LuEye, LuEyeOff, LuFacebook, LuInstagram } from '@qwikest/icons/lucide';
import { _ } from 'compiled-i18n';
import SocialLoginButtons from '~/components/SocialLoginButtons';
import { Button } from '~/components/ui';

export default component$(() => {
    const isPasswordVisible = useSignal(false);

    return (
        <div class="min-h-screen flex items-center justify-center bg-background p-4">
            <div class="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
                <div class="text-center mb-6">
                    <h1 class="text-3xl font-bold">{_`Join us!`}</h1>
                    <p class="text-muted-foreground mt-2">{_`Create your account in seconds.`}</p>
                </div>

                {/* Social login buttons */}
                <div class="space-y-3 mb-6">
                    <button
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg shadow-xs 
            text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden 
            focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                    >
                        <LuFacebook class="h-5 w-5 text-blue-600" />
                        <span>{_`Continue with Facebook`}</span>
                    </button>

                    <button
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg shadow-xs 
            text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden 
            focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                    >
                        <LuInstagram class="h-5 w-5 text-rose-500" />
                        <span>{_`Continue with Instagram`}</span>
                    </button>

                    <SocialLoginButtons />
                </div>

                {/* Divider */}
                <div class="relative flex items-center my-6">
                    <div class="flex-grow border-t border-gray-300"></div>
                    <span class="flex-shrink mx-4 text-muted-foreground text-sm">{_`OR`}</span>
                    <div class="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Registration form */}
                <form class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="firstName" class="block text-sm font-medium mb-1">{_`First Name`}</label>
                            <input
                                type="text"
                                id="firstName"
                                placeholder="John"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium mb-1">{_`Last Name`}</label>
                            <input
                                type="text"
                                id="lastName"
                                placeholder="Doe"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium mb-1">{_`Email`}</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="john@email.com"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium mb-1">{_`Password`}</label>
                        <div class="relative">
                            <input
                                type={isPasswordVisible.value ? "text" : "password"}
                                id="password"
                                placeholder="Minimum 6 characters"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick$={() => isPasswordVisible.value = !isPasswordVisible.value}
                                class="absolute inset-y-0 right-0 mr-3 flex items-center text-sm text-gray-400 hover:text-gray-500"
                            >
                                {isPasswordVisible.value ? <LuEyeOff /> : <LuEye />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        class="w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors duration-200"
                    >
                        {_`Create your account`}
                    </Button>
                </form>

                <div class="mt-6 text-center text-sm">
                    <span class="text-muted-foreground">{_`Already have an account?`}</span>{" "}
                    <Link href="/login" class="text-primary hover:underline">{_`Sign in`}</Link>
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: 'Sign Up - Create a new account',
    meta: [
        {
            name: 'description',
            content: 'Sign up and start creating online raffles in minutes.',
        },
    ],
};
