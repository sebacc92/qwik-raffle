import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuGift, LuX, LuUser, LuLogOut } from '@qwikest/icons/lucide';
import ThemeToggle from '~/components/ThemeToggle';
import { LocaleSelector } from '~/components/locale-selector';
import { Avatar, Button, Dropdown, Modal } from '~/components/ui';
import SocialLoginButtons from '~/components/SocialLoginButtons';
import { useSession, useSignOut } from '~/routes/plugin@auth';
import { _ } from 'compiled-i18n';

export default component$(() => {
    const session = useSession();
    const signOut = useSignOut();
    const show = useSignal(false);

    return (
        <header class="w-full py-2 px-4 md:px-6 flex items-center justify-between border-b border-border shadow-xs sticky top-0 z-30 bg-background/95 backdrop-blur-sm">
            <div class="flex items-center">
                <Link href="/" class="flex items-center">
                    <LuGift class="h-8 w-8 text-primary dark:text-purple-400 animate-pulse" />
                    <span class="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-primary-hover dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
                        QwikRaffle
                    </span>
                </Link>
            </div>
            <div class="flex items-center space-x-4">
                {session.value ? (
                    <Dropdown.Root>
                        <Dropdown.Trigger class="p-0 cursor-pointer">
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
                                <Link href="/users/me" class="flex items-center gap-2 w-full flex-nowrap">
                                    <LuUser class="h-4 w-4" />
                                    <span>{_`My Raffles`}</span>
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Separator />
                            <Dropdown.Item class="px-4 py-2">
                                <div class="flex items-center gap-2 whitespace-nowrap cursor-pointer" onClick$={() => signOut.submit({ redirectTo: "/" })}>
                                    <LuLogOut class="w-5 h-5" /> 
                                    <span>{_`Sign Out`}</span>
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Popover>
                    </Dropdown.Root>
                ) : (
                    <>
                        <Modal.Root bind:show={show}>
                            <Modal.Trigger class="transition-all duration-200 hover:font-medium">
                                {_`Sign In`}
                            </Modal.Trigger>
                            <Modal.Panel>
                                <div class="flex items-center justify-between">
                                    <Modal.Title>{_`Login`}</Modal.Title>
                                    <Modal.Close class="transition-transform duration-200">
                                        <LuX class="h-5 w-5" />
                                    </Modal.Close>
                                </div>
                                <Modal.Description class="mb-4">{_`Login to your account`}</Modal.Description>
                                <SocialLoginButtons />
                            </Modal.Panel>
                        </Modal.Root>
                        <Link href="/signup">
                            <Button
                                look="primary"
                            >
                                {_`Sign Up`}
                            </Button>
                        </Link>
                    </>
                )}
                <LocaleSelector />
                <ThemeToggle />
            </div>
        </header>
    );
});