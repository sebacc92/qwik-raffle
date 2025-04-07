import { type QRL, type Signal, Slot, component$, useSignal, useStylesScoped$ } from '@builder.io/qwik';
import { LuX } from '@qwikest/icons/lucide';
import { cn } from '@qwik-ui/utils';
import { Button, Modal, buttonVariants } from '~/components/ui';
import styles from "~/routes/raffle/[uuid]/wheel/wheel.css?inline";
import { _ } from 'compiled-i18n';

export interface SheetProps {
    position?: 'right' | 'left' | 'top' | 'bottom';
    createSegments: QRL<() => void>;
    selectedColorScheme: Signal<string>;
    canvasSize: Signal<number>;
    fontStyle: Signal<string>;
    textColor: Signal<string>;
    wheelBorderColor: Signal<string>;
    wheelBorderWidth: Signal<number>;
    pointerColor: Signal<string>;
    wheelSpeed: Signal<number>;
    showBuyerNames: Signal<boolean>;
    showTicketNumbers: Signal<boolean>;
    showSettings: Signal<boolean>;
}

export default component$<SheetProps>(({
    createSegments,
    position,
    selectedColorScheme,
    canvasSize,
    fontStyle,
    textColor,
    wheelBorderColor,
    wheelBorderWidth,
    pointerColor,
    wheelSpeed,
    showBuyerNames,
    showTicketNumbers,
    showSettings
}) => {
    // Color schemes
    const colorSchemes = {
        rainbow: ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"],
        purple: ["#F3E8FF", "#E9D5FF", "#D8B4FE", "#C084FC", "#A855F7", "#9333EA"],
        blue: ["#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB"],
        green: ["#ECFCCB", "#D9F99D", "#BEF264", "#A3E635", "#84CC16", "#65A30D"],
        sunset: ["#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#D97706"],
        ocean: ["#CFFAFE", "#A5F3FC", "#67E8F9", "#22D3EE", "#06B6D4", "#0891B2"]
    };
    useStylesScoped$(styles);

    return (
        <Modal.Root bind:show={showSettings}>
            <Modal.Trigger class={[buttonVariants({ look: 'ghost' }), 'w-20']}>
                <Slot />
            </Modal.Trigger>
            <Modal.Panel position={position}>
                <Modal.Title>{_`Wheel Settings`}</Modal.Title>
                <Modal.Description>
                    {_("Here you can customize the appearance of the wheel")}
                </Modal.Description>
                <div class="settings-content">
                    <div class="settings-section">
                        <h4>{_`Appearance`}</h4>
                        <div class="setting-group">
                            <label>{_`Color Scheme`}</label>
                            <div class="color-schemes">
                                {Object.keys(colorSchemes).map((scheme) => (
                                    <button
                                        key={scheme}
                                        onClick$={() => {
                                            selectedColorScheme.value = scheme as any;
                                            createSegments();
                                        }}
                                        class={`color-scheme-btn ${scheme} ${selectedColorScheme.value === scheme ? 'selected' : ''}`}
                                        title={scheme}
                                    ></button>
                                ))}
                            </div>
                        </div>
                        <div class="setting-group">
                            <label for="wheel-size">{_`Wheel Size: ${canvasSize.value}px`}</label>
                            <input
                                id="wheel-size"
                                type="range"
                                min="300"
                                max="800"
                                step="50"
                                value={canvasSize.value}
                                onChange$={(e: any) => canvasSize.value = parseInt(e.target.value)}
                            />
                        </div>
                        <div class="setting-group">
                            <label>{_`Font Style`}</label>
                            <select
                                value={fontStyle.value}
                                onChange$={(e: any) => fontStyle.value = e.target.value}
                            >
                                <option value="default">{_`Default`}</option>
                                <option value="bold">{_`Bold`}</option>
                                <option value="retro">{_`Retro`}</option>
                                <option value="elegant">{_`Elegant`}</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label>{_`Text Color`}</label>
                            <input
                                type="color"
                                value={textColor.value}
                                onChange$={(e: any) => textColor.value = e.target.value}
                            />
                        </div>
                        <div class="setting-group">
                            <label>{_`Wheel Border Color`}</label>
                            <input
                                type="color"
                                value={wheelBorderColor.value}
                                onChange$={(e: any) => wheelBorderColor.value = e.target.value}
                            />
                        </div>
                        <div class="setting-group">
                            <label>{_`Wheel Border Width: ${wheelBorderWidth.value}px`}</label>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={wheelBorderWidth.value}
                                onChange$={(e: any) => wheelBorderWidth.value = parseInt(e.target.value)}
                            />
                        </div>
                        <div class="setting-group">
                            <label>{_`Pointer Color`}</label>
                            <input
                                type="color"
                                value={pointerColor.value}
                                onChange$={(e: any) => pointerColor.value = e.target.value}
                            />
                        </div>
                    </div>
                    <div class="settings-section">
                        <h4>{_`Behavior`}</h4>

                        <div class="setting-group">
                            <label for="wheel-speed">{_`Wheel Speed: ${wheelSpeed.value}`}</label>
                            <input
                                id="wheel-speed"
                                type="range"
                                min="1"
                                max="10"
                                value={wheelSpeed.value}
                                onChange$={(e: any) => wheelSpeed.value = parseInt(e.target.value)}
                            />
                        </div>

                        <div class="setting-group">
                            <label class="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={showBuyerNames.value}
                                    onChange$={() => showBuyerNames.value = !showBuyerNames.value}
                                />
                                {_`Show buyer names`}
                            </label>
                        </div>

                        <div class="setting-group">
                            <label class="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={showTicketNumbers.value}
                                    onChange$={() => showTicketNumbers.value = !showTicketNumbers.value}
                                />
                                {_`Show ticket numbers`}
                            </label>
                        </div>
                    </div>
                </div>
                <footer class="mt-6">
                    <Button look="primary" onClick$={() => (show.value = false)}>
                        Save
                    </Button>
                </footer>
                <Modal.Close
                    class={cn(
                        buttonVariants({ size: 'icon', look: 'link' }),
                        'absolute right-3 top-2',
                    )}
                    type="submit"
                >
                    <LuX class="h-5 w-5" />
                </Modal.Close>
            </Modal.Panel>
        </Modal.Root>
    );
});