import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { LuEye, LuEyeOff, LuFacebook, LuInstagram, LuMail, LuLock } from '@qwikest/icons/lucide';
import { _ } from 'compiled-i18n';
import SocialLoginButtons from '~/components/SocialLoginButtons';
import { Button } from '~/components/ui';

export default component$(() => {
    const isPasswordVisible = useSignal(false);

    return (
        <div class="min-h-screen flex items-center justify-center bg-background p-4">
            <div class="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
                <div class="text-center mb-6">
                    <h1 class="text-3xl font-bold">{_`Hello!`}</h1>
                    <p class="text-muted-foreground mt-2">{_`Log in to your account here`}</p>
                </div>

                {/* Social login buttons */}
                <div class="space-y-3 mb-6">
                    <button
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg shadow-xs 
            text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden 
            focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                    >
                        <LuFacebook class="h-5 w-5 text-blue-600" />
                        <span>{_`Log in with Facebook`}</span>
                    </button>

                    <button
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg shadow-xs 
            text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden 
            focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                    >
                        <LuInstagram class="h-5 w-5 text-rose-500" />
                        <span>{_`Log in with Instagram`}</span>
                    </button>

                    <SocialLoginButtons />
                </div>

                {/* Divider */}
                <div class="relative flex items-center my-6">
                    <div class="flex-grow border-t border-gray-300"></div>
                    <span class="flex-shrink mx-4 text-muted-foreground text-sm">{_`OR`}</span>
                    <div class="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Login form */}
                <form class="space-y-4 mt-6">
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LuMail class="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LuLock class="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={isPasswordVisible.value ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary"
                        />
                        <button
                            type="button"
                            onClick$={() => isPasswordVisible.value = !isPasswordVisible.value}
                            class="absolute inset-y-0 right-0 mr-3 flex items-center text-sm text-gray-400 hover:text-gray-500"
                        >
                            {isPasswordVisible.value ? <LuEyeOff /> : <LuEye />}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        class="w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors duration-200"
                    >
                        {_`Log in`}
                    </Button>
                </form>

                <div class="mt-6 text-center text-sm space-y-2">
                    <div>
                        <span class="text-muted-foreground">{_`Forgot your password?`}</span>{" "}
                        <Link href="/recover" class="text-primary hover:underline">{_`Recover`}
                        </Link>
                    </div>
                    <div>
                        <span class="text-muted-foreground">{_`Don't have an account?`}</span>{" "}
                        <Link href="/signup" class="text-primary hover:underline">{_`Create account`}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: 'Log In',
    meta: [
        {
            name: 'description',
            content: 'Log in to your account to access your sweepstakes.',
        },
    ],
};
