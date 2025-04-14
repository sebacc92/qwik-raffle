import { component$ } from '@builder.io/qwik';
import { LuGift } from '@qwikest/icons/lucide';
import type { Prize } from '~/shared/indexedDB/config';

interface PrizesListProps {
    prizes: Prize[];
}

export default component$<PrizesListProps>(({ prizes }) => {
    return (
        <div class="prizes-container bg-white rounded-lg shadow-xs border border-purple-100 p-4">
            <div class="flex items-center gap-2 mb-3">
                <LuGift class="w-5 h-5 text-purple-600" />
                <h2 class="text-lg font-semibold text-purple-800">Prizes</h2>
            </div>
            <div class="prizes-grid">
                {prizes.map((prize, index) => (
                    <div 
                        key={index}
                        class="prize-item flex items-center gap-2 bg-purple-50 rounded-md p-3"
                    >
                        <span class="prize-number flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm font-medium">
                            {index + 1}
                        </span>
                        <span class="prize-name text-purple-900">{prize.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}); 