import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { useServerSession } from "~/shared/loaders";
import { LuCalendar, LuChevronRight, LuCrown, LuPlusCircle, LuTicket, LuUser } from "@qwikest/icons/lucide";
import Drizzler from "../../../../drizzle";
import { schema } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import styles from './profile.css?inline';
import { Link } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";

// Loader to get all raffles of the current user
export const useUserRaffles = routeLoader$(async (requestEvent) => {
    const session = requestEvent.sharedMap.get("session") as any;

    if (!session) {
        return {
            active: [],
            closed: []
        };
    }

    const db = Drizzler();
    const user = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, session.user.email))
        .execute();

    if (user.length === 0) {
        return {
            active: [],
            closed: []
        };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to 00:00:00 of the current day

    // Get all user's raffles
    const raffles = await db
        .select()
        .from(schema.raffles)
        .where(eq(schema.raffles.creatorId, user[0].id))
        .execute();
    
    // Separate active raffles from closed ones
    // We consider a raffle as active even if its expiration date is today
    // This solves the problem of new raffles appearing as finished
    const active = raffles.filter(raffle => {
        const expiresDate = new Date(raffle.expiresAt);
        expiresDate.setHours(0, 0, 0, 0); // Normalize to 00:00:00 of the expiration day
        return expiresDate >= now && !raffle.isTemporary;
    });
    
    const closed = raffles.filter(raffle => {
        const expiresDate = new Date(raffle.expiresAt);
        expiresDate.setHours(0, 0, 0, 0); // Normalize to 00:00:00 of the expiration day
        return expiresDate < now || raffle.isTemporary;
    });

    return {
        active,
        closed
    };
});

export default component$(() => {
    useStylesScoped$(styles);
    const userSession = useServerSession();
    const userRaffles = useUserRaffles();
    
    const isPremium = userSession.value.isPremium;
    
    // Check if the user is authenticated
    if (!userSession.value.session) {
        return (
            <div class="container mx-auto px-4 py-8">
                <div class="text-center">
                    <h1 class="text-2xl font-bold mb-4">{_`No has iniciado sesión`}</h1>
                    <p class="mb-6">{_`Debes iniciar sesión para ver tu perfil`}</p>
                </div>
            </div>
        );
    }
    
    // User data obtained directly from the session
    const userName = userSession.value.session.user.name;
    const userEmail = userSession.value.session.user.email;

    return (
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-8 text-center md:text-left">{_`Mi Perfil`}</h1>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left panel - User information */}
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                <LuUser class="w-8 h-8 text-purple-600" />
                            </div>
                            <div>
                                <h2 class="text-xl font-bold">{userName}</h2>
                                <p class="text-gray-600">{userEmail}</p>
                            </div>
                        </div>

                        <div class="subscription-status mb-6">
                            <div class={`p-4 rounded-lg ${isPremium ? 'bg-gradient-to-r from-amber-100 to-amber-200' : 'bg-gray-100'}`}>
                                <div class="flex items-center gap-3">
                                    <LuCrown class={`w-5 h-5 ${isPremium ? 'text-amber-600' : 'text-gray-500'}`} />
                                    <span class="font-medium">
                                        {isPremium ? _`Plan Plus` : _`Plan Free`}
                                    </span>
                                </div>
                                {isPremium && (
                                    <div class="mt-2 text-sm text-amber-800">
                                        {_`Tu suscripción Plus está activa. ¡Disfruta de todos los beneficios!`}
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isPremium && (
                            <div class="upgrade-card bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 mb-6">
                                <h3 class="text-lg font-bold text-purple-800 mb-2">{_`¡Mejora a Plan Plus!`}</h3>
                                <ul class="mb-4 space-y-2">
                                    <li class="flex items-start gap-2">
                                        <LuTicket class="w-5 h-5 text-purple-600 mt-0.5" />
                                        <span class="text-sm">{_`Crea rifas ilimitadas sin restricciones de tiempo`}</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <LuPlusCircle class="w-5 h-5 text-purple-600 mt-0.5" />
                                        <span class="text-sm">{_`Añade hasta 10 premios por rifa`}</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <LuCalendar class="w-5 h-5 text-purple-600 mt-0.5" />
                                        <span class="text-sm">{_`Rifas con fechas de vencimiento extendidas`}</span>
                                    </li>
                                </ul>
                                <button class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors">
                                    {_`Actualizar ahora`}
                                </button>
                            </div>
                        )}

                        <div class="stats">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="stat-card bg-gray-50 p-4 rounded-lg">
                                    <div class="text-2xl font-bold text-purple-600">{userRaffles.value.active.length}</div>
                                    <div class="text-sm text-gray-600">{_`Rifas activas`}</div>
                                </div>
                                <div class="stat-card bg-gray-50 p-4 rounded-lg">
                                    <div class="text-2xl font-bold text-purple-600">{userRaffles.value.closed.length}</div>
                                    <div class="text-sm text-gray-600">{_`Rifas finalizadas`}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel - List of raffles */}
                <div class="lg:col-span-2">
                    {/* Active raffles */}
                    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold">{_`Mis Rifas Activas`}</h2>
                            {userRaffles.value.active.length > 0 && (
                                <Link href="/raffle/create" class="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1">
                                    <LuPlusCircle class="w-4 h-4" />
                                    {_`Crear nueva rifa`}
                                </Link>
                            )}
                        </div>

                        {userRaffles.value.active.length === 0 ? (
                            <div class="text-center py-8 text-gray-500">
                                <LuTicket class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>{_`No tienes rifas activas actualmente`}</p>
                                <Link href="/raffle/create" class="mt-4 inline-block text-purple-600 hover:text-purple-800">
                                    {_`Crear mi primera rifa`}
                                </Link>
                            </div>
                        ) : (
                            <div class="space-y-4">
                                {userRaffles.value.active.map((raffle) => (
                                    <Link key={raffle.id} href={`/raffle/${raffle.uuid}`} class="raffle-card block">
                                        <div class="border border-gray-200 hover:border-purple-300 rounded-lg p-4 transition-all hover:shadow-md">
                                            <div class="flex justify-between items-center">
                                                <div>
                                                    <h3 class="font-medium text-lg">{raffle.name}</h3>
                                                    <div class="flex gap-6 mt-2 text-sm text-gray-600">
                                                        <div class="flex items-center gap-1">
                                                            <LuTicket class="w-4 h-4" />
                                                            <span>{raffle.numberCount} {_`números`}</span>
                                                        </div>
                                                        <div class="flex items-center gap-1">
                                                            <span>${raffle.pricePerNumber}</span>
                                                            <span>{_`por número`}</span>
                                                        </div>
                                                    </div>
                                                    <div class="mt-2 text-sm text-gray-500">
                                                        <span>{_`Vence`}: {new Date(raffle.expiresAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <LuChevronRight class="w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Finished raffles */}
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h2 class="text-xl font-bold mb-4">{_`Rifas Finalizadas`}</h2>

                        {userRaffles.value.closed.length === 0 ? (
                            <div class="text-center py-8 text-gray-500">
                                <p>{_`No tienes rifas finalizadas`}</p>
                            </div>
                        ) : (
                            <div class="space-y-4">
                                {userRaffles.value.closed.map((raffle) => (
                                    <Link key={raffle.id} href={`/raffle/${raffle.uuid}`} class="raffle-card block">
                                        <div class="border border-gray-200 hover:border-purple-300 rounded-lg p-4 transition-all hover:shadow-md">
                                            <div class="flex justify-between items-center">
                                                <div>
                                                    <h3 class="font-medium text-lg">{raffle.name}</h3>
                                                    <div class="flex gap-6 mt-2 text-sm text-gray-600">
                                                        <div class="flex items-center gap-1">
                                                            <LuTicket class="w-4 h-4" />
                                                            <span>{raffle.numberCount} {_`números`}</span>
                                                        </div>
                                                        <div class="flex items-center gap-1">
                                                            <span>${raffle.pricePerNumber}</span>
                                                            <span>{_`por número`}</span>
                                                        </div>
                                                    </div>
                                                    <div class="mt-2 text-sm text-gray-500">
                                                        <span>{_`Finalizada el`}: {new Date(raffle.expiresAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <LuChevronRight class="w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = () => {
    return {
        title: _`Mi Perfil | Qwik Raffle`,
        meta: [
            {
                name: "description",
                content: _`Administra tus rifas, revisa tu perfil y gestiona tu suscripción`,
            },
        ],
    };
};