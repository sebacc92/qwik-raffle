import { component$, type PropFunction } from "@builder.io/qwik";
import { LuX, LuTrophy, LuRefreshCw } from "@qwikest/icons/lucide";
import type { Ticket } from "~/routes/raffle/[uuid]/index";
import { _ } from "compiled-i18n";
import "./WinnerDisplay.css";

export interface WinnerDisplayProps {
    winner: Ticket | null;
    prizePosition: number;
    prizeName?: string;
    onClose$: PropFunction<() => void>;
    onSpinAgain$?: PropFunction<() => void>;
    canSpinAgain?: boolean;
}

export default component$<WinnerDisplayProps>(({
    winner,
    prizePosition,
    prizeName,
    onClose$,
    onSpinAgain$,
    canSpinAgain = false
}) => {
    if (!winner) return null;

    return (
        <div class="winner-display">
            <div class="winner-content">
                {/* Close button positioned at top-right */}
                <button
                    class="close-winner top-right"
                    onClick$={onClose$}
                    aria-label="Close"
                >
                    <LuX class="w-5 h-5" />
                </button>

                <h3 class="winner-title">{_`Winner!`}</h3>

                <div class="winner-info">
                    <div class="winner-ticket">
                        <span class="ticket-number">#{winner.number}</span>
                    </div>
                    {winner.buyerName && (
                        <div class="winner-name">
                            <span>{winner.buyerName}</span>
                        </div>
                    )}
                    {winner.buyerPhone && (
                        <div class="winner-phone">
                            <span>{winner.buyerPhone}</span>
                        </div>
                    )}
                </div>

                <div class="prize-info">
                    <LuTrophy class="trophy-icon-win w-6 h-6" />
                    <span class="prize-name">
                        {_`Prize #${prizePosition}: ${prizeName || "Prize"}`}
                    </span>
                </div>

                <div class="winner-actions">
                    {/* Spin again button - only show if allowed */}
                    {canSpinAgain && onSpinAgain$ && (
                        <button
                            class="spin-again-button"
                            onClick$={onSpinAgain$}
                        >
                            <LuRefreshCw class="w-5 h-5 mr-2" />
                            {_`Spin Again`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});