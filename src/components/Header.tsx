import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuGift, LuX, LuUser, LuLogOut } from '@qwikest/icons/lucide';
import ThemeToggle from '~/components/ThemeToggle';
import { Avatar, Dropdown, Modal } from '~/components/ui';
import SocialLoginButtons from '~/components/SocialLoginButtons';
import { useSession, useSignOut } from '~/routes/plugin@auth';

export default component$(() => {
    const session = useSession();
    const signOut = useSignOut();
    const show = useSignal(false);

    return (
        <header class="w-full py-4 px-4 md:px-6 flex items-center justify-between border-b border-border shadow-sm sticky top-0 z-30 bg-background/95 backdrop-blur-sm">
            <div class="flex items-center">
                <Link href="/" class="flex items-center">
                    <LuGift class="h-8 w-8 text-primary animate-pulse" />
                    <span class="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">QwikRaffle</span>
                </Link>
            </div>
            <div class="flex items-center space-x-4">
                <ThemeToggle />
                {session.value ? (
                    <Dropdown.Root>
                        <Dropdown.Trigger class="p-0">
                            <Avatar.Root>
                                <Avatar.Image
                                    src={session.value.user?.image || undefined}
                                    alt={session.value.user?.name || 'User avatar'}
                                />
                                <Avatar.Fallback>{session.value.user?.name?.[0]?.toUpperCase()}</Avatar.Fallback>
                            </Avatar.Root>
                        </Dropdown.Trigger>
                        <Dropdown.Popover gutter={8}>
                            <Dropdown.Item class="px-4 py-2 whitespace-nowrap">
                                <Link href="/users/profile" class="flex items-center gap-2 w-full flex-nowrap">
                                    <LuUser class="h-4 w-4" />
                                    <span>My Profile</span>
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Separator />
                            <Dropdown.Item class="px-4 py-2">
                                <div class="flex items-center gap-2 whitespace-nowrap" onClick$={() => signOut.submit({ redirectTo: "/" })}>
                                    <LuLogOut class="w-5 h-5" /> 
                                    <span>Sign Out</span>
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Popover>
                    </Dropdown.Root>
                ) : (
                    <Modal.Root bind:show={show}>
                        <Modal.Trigger>
                            Sign In
                        </Modal.Trigger>
                        <Modal.Panel>
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
                )}
            </div>
        </header>
    );
});