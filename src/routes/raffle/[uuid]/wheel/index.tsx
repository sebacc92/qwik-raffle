import { component$, useSignal, useStylesScoped$, useVisibleTask$, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useGetRaffle, useGetRaffleNumbers } from "~/shared/loaders";
import { LuVolume2, LuVolumeX, LuTrophy, LuChevronLeft, LuSettings, LuDownload, LuX, LuLoader2, LuMaximize, LuMinimize } from "@qwikest/icons/lucide";
import type { Ticket } from "~/routes/raffle/[uuid]/index";
import styles from "./wheel.css?inline";
import { toast } from "qwik-sonner";
import { _ } from "compiled-i18n";
import WinnerDisplay from "~/components/modals/WinnerDisplay";
import SheetSettingsWheel from "~/components/SheetSettingsWheel";

export { useGetRaffle, useGetRaffleNumbers } from "~/shared/loaders";

const MIN_ROTATIONS = 5;
const MAX_ROTATIONS = 10;

export interface WheelSegment {
  ticket: Ticket;
  color: string;
}

export default component$(() => {
  useStylesScoped$(styles);

  const navigating = useSignal<boolean>(false)
  const isFullscreen = useSignal<boolean>(false);

  // Get raffle data
  const raffle = useGetRaffle();
  const raffleNumbers = useGetRaffleNumbers();
  
  // State for the wheel
  const isSpinning = useSignal(false);
  const currentPrize = useSignal(1);
  const winners = useSignal<Array<{ ticket: Ticket; prizeIndex: number }>>([]);
  const eligibleTickets = useSignal<Ticket[]>([]);
  const segments = useSignal<WheelSegment[]>([]);
  const canvasSize = useSignal(600); // Default size, will be updated in browser
  const showBuyerNames = useSignal(true);
  const enableSound = useSignal(true);
  const selectedColorScheme = useSignal<"rainbow" | "purple" | "blue" | "green" | "sunset" | "ocean">("purple");
  const rotationAngle = useSignal(0);
  const winnerDisplayed = useSignal<Ticket | null>(null);
  const confettiActivated = useSignal(false);
  const showSettings = useSignal(false);
  const wheelSpeed = useSignal(5); // 1-10 speed scale
  const textColor = useSignal("#4B5563"); // Default text color
  const fontStyle = useSignal<"default" | "bold" | "retro" | "elegant">("default");
  const confettiColors = useSignal<string[]>(["#7C3AED", "#A855F7", "#D8B4FE", "#F3E8FF", "#EDE9FE"]);
  const wheelBorderColor = useSignal("#FFFFFF");
  const wheelBorderWidth = useSignal(3);
  const pointerColor = useSignal("#7C3AED");
  const showTicketNumbers = useSignal(true);
  const wheelCenterImage = useSignal<string | null>(null);

  // Variables to track pin position and sound
  const lastSegmentIndex = useSignal(-1);
  const pinSound = useSignal<HTMLAudioElement | null>(null);
  const completeSound = useSignal<HTMLAudioElement | null>(null);

  // Function to check if pin hits a dot and play sound
  const checkPinDotCollision = $(() => {
    if (!isSpinning.value || segments.value.length === 0) return;
    
    // Calculate which segment the pin is pointing to
    const segmentCount = segments.value.length;
    const sliceAngle = (2 * Math.PI) / segmentCount;
    
    // The pin is fixed at the top (3π/2 or -π/2 in the unit circle)
    // Calculate which segment it's pointing to based on current rotation
    const pinPosition = -Math.PI / 2; // Fixed pin position (top of wheel)
    
    // Normalize the rotation angle to be between 0 and 2π
    let normalizedAngle = rotationAngle.value % (2 * Math.PI);
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
    
    // Calculate the segment index that the pin is pointing to
    // We add π/2 to adjust for the pin being at the top position
    let segmentIndex = Math.floor(((pinPosition - normalizedAngle + Math.PI / 2) % (2 * Math.PI)) / sliceAngle);
    if (segmentIndex < 0) segmentIndex += segmentCount;
    
    // If we've moved to a new segment, play the sound
    if (segmentIndex !== lastSegmentIndex.value) {
      lastSegmentIndex.value = segmentIndex;
      
      // Play the click sound when crossing segments
      if (enableSound.value && pinSound.value) {
        // Reset and play the sound
        pinSound.value.currentTime = 0;
        pinSound.value.play().catch(e => console.error("Error playing sound:", e));
      } else if (enableSound.value) {
        // Lazy-load the sound if it hasn't been created yet
        pinSound.value = new Audio("/sounds/spin_wheel.ogg");
        pinSound.value.play().catch(e => console.error("Error playing sound:", e));
      }
    }
  });

  // Color schemes
  const colorSchemes = {
    rainbow: ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"],
    purple: ["#F3E8FF", "#E9D5FF", "#D8B4FE", "#C084FC", "#A855F7", "#9333EA"],
    blue: ["#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB"],
    green: ["#ECFCCB", "#D9F99D", "#BEF264", "#A3E635", "#84CC16", "#65A30D"],
    sunset: ["#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#D97706"],
    ocean: ["#CFFAFE", "#A5F3FC", "#67E8F9", "#22D3EE", "#06B6D4", "#0891B2"]
  };

  // Font styles
  const fontStyles = {
    default: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    bold: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
    retro: "'Courier New', Courier, monospace",
    elegant: "Georgia, 'Times New Roman', Times, serif"
  };
  
  // Create wheel segments with colors
  const createSegments = $(() => {
    if (eligibleTickets.value.length === 0) return;
    
    // Reset segments
    segments.value = [];
    
    const tickets = eligibleTickets.value;
    const colors = colorSchemes[selectedColorScheme.value];
    
    segments.value = tickets.map((ticket, index) => ({
      ticket,
      color: colors[index % colors.length]
    }));
  });

  // Initialize with eligible tickets
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => raffleNumbers.value);
    
    // Only include paid tickets
    const paid = raffleNumbers.value.filter(t => t.status === "sold-paid");
    eligibleTickets.value = [...paid];
    
    // Create wheel segments
    createSegments();
  });


  // Trigger confetti
  const triggerConfetti = $(() => {
    const confetti = typeof window !== "undefined" ? (window as any).confetti : null;
    if (confetti) {
      confetti({
        particleCount: 150,
        spread: 70,
        colors: confettiColors.value,
        origin: { y: 0.6 }
      });
    }
  });

  // Function to draw the wheel
  const drawWheel = $(() => {
    const canvas = document.getElementById("wheel-canvas") as HTMLCanvasElement;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (segments.value.length === 0) return;
    
    const sliceAngle = (2 * Math.PI) / segments.value.length;
    
    // Draw the wheel sections
    for (let i = 0; i < segments.value.length; i++) {
      const startAngle = i * sliceAngle + rotationAngle.value;
      const endAngle = (i + 1) * sliceAngle + rotationAngle.value;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Fill with segment color
      ctx.fillStyle = segments.value[i].color;
      ctx.fill();
      
      // Add border
      ctx.strokeStyle = wheelBorderColor.value;
      ctx.lineWidth = wheelBorderWidth.value;
      ctx.stroke();
      
      // Add text (ticket number and name if enabled)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = textColor.value;
      ctx.font = `bold ${radius / 15}px ${fontStyles[fontStyle.value]}`;
      
      const ticket = segments.value[i].ticket;
      let text = "";
      
      if (showTicketNumbers.value) {
        text = `#${ticket.number}`;
      }
      
      if (showBuyerNames.value && ticket.buyerName) {
        text += text ? ` - ${ticket.buyerName}` : ticket.buyerName;
      }
      
      // Limit the text so it's not too long
      if (text.length > 15) {
        text = text.substring(0, 15) + "...";
      }
      
      if (text) {
        ctx.fillText(text, radius - 20, 5);
      }
      ctx.restore();
    }
    
    // Draw the white dots at segment boundaries (similar to the second image)
    for (let i = 0; i < segments.value.length; i++) {
      const dotAngle = i * sliceAngle + rotationAngle.value;
      const dotX = centerX + radius * Math.cos(dotAngle);
      const dotY = centerY + radius * Math.sin(dotAngle);
      
      // Draw white dot
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = "#DDDDDD";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Draw the center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = pointerColor.value;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw the center image if available
    if (wheelCenterImage.value) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, centerX - 18, centerY - 18, 36, 36);
        ctx.restore();
      };
      img.src = wheelCenterImage.value;
    }
  });

  // Initialize the wheel and load the confetti library
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    // Function to handle window resize
    const handleResize = () => {
      // Adjust the canvas size based on window size and device orientation
      const containerWidth = isFullscreen.value ? 
        Math.min(window.innerWidth, window.innerHeight * 0.85) : 
        Math.min(window.innerWidth * 0.9, 600);
      
      canvasSize.value = Math.floor(containerWidth);
    };
    
    // Handle window resize
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // Load the confetti script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
    document.body.appendChild(script);
    
    // Preload sound effects
    if (enableSound.value) {
      pinSound.value = new Audio("/sounds/spin_wheel.ogg");
      completeSound.value = new Audio("/sounds/spin-complete.mp3");
    }

    // Initialize the wheel
    drawWheel();

    cleanup(() => {
      window.removeEventListener("resize", handleResize);
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    });
  });

  // Redraw when relevant values change
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => [
      segments.value,
      canvasSize.value,
      showBuyerNames.value,
      selectedColorScheme.value,
      rotationAngle.value,
      textColor.value,
      wheelBorderColor.value,
      wheelBorderWidth.value,
      pointerColor.value,
      showTicketNumbers.value,
      fontStyle.value
    ]);
    
    drawWheel();
  });

  // Function to spin the wheel and select a winner
  const spinWheel = $(async () => {
    if (isSpinning.value || segments.value.length === 0) return;
    
    // Reset the displayed winner
    winnerDisplayed.value = null;
    confettiActivated.value = false;
    
    // Check if there are any prizes left to draw
    const prizeCount = raffle.value.prizes?.length || 0;
    if (currentPrize.value > prizeCount) {
      toast.info(_`All prizes have been drawn`, {
        position: "top-center"
      });
      return;
    }
    
    isSpinning.value = true;
    
    // Play sound if enabled
    if (enableSound.value) {
      const audio = new Audio("/sounds/wheel-spin.mp3");
      audio.play().catch(e => console.error("Error playing sound:", e));
    }
    
    // Select a random winner
    const randomIndex = Math.floor(Math.random() * segments.value.length);
    const winningSegment = segments.value[randomIndex];
    
    // Calculate the angle at which the wheel should stop
    const sliceAngle = (2 * Math.PI) / segments.value.length;
    const targetAngle = -Math.PI / 2 - (randomIndex + 0.5) * sliceAngle;
    
    const fullRotations = MIN_ROTATIONS + Math.floor(Math.random() * (MAX_ROTATIONS - MIN_ROTATIONS));
    
    // Calculate final angle to ensure the wheel always spins with consistent momentum
    // regardless of its current position
    const finalAngle = rotationAngle.value + (fullRotations * 2 * Math.PI) + (targetAngle - rotationAngle.value % (2 * Math.PI));
    
    // Animate the wheel
    const startTime = Date.now();
    
    // Set duration to approximately 7-10 seconds, adjusted by wheel speed
    const baseDuration = 8500;
    const speedFactor = (11 - wheelSpeed.value) / 5; // Convert 1-10 scale to a 2.0-0.2 multiplier
    const duration = baseDuration * speedFactor; 
    
    // Always use a fixed starting point for consistent animation
    const initialAngle = rotationAngle.value % (2 * Math.PI);
    const totalRotation = finalAngle - initialAngle;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Simple power curve for natural deceleration - higher power means more dramatic slowdown
      // A higher exponent gives a faster start and more gradual slowdown
      const naturalEasing = (t: number) => {
        // Using a single power function for smooth natural slowing
        return 1 - Math.pow(1 - t, 4);
      };
      
      // Calculate the current angle with natural easing
      const easedProgress = naturalEasing(progress);
      rotationAngle.value = initialAngle + totalRotation * easedProgress;
      
      // Check for pin-dot collision
      checkPinDotCollision();
      
      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation finished
        isSpinning.value = false;
        
        // Save winner to list
        winners.value = [...winners.value, {
          prizeIndex: currentPrize.value,
          ticket: winningSegment.ticket
        }];
        
        // Display the winner
        winnerDisplayed.value = winningSegment.ticket;
        
        // Trigger confetti
        if (!confettiActivated.value) {
          triggerConfetti();
          confettiActivated.value = true;
        }
        
        // Play winning sound if enabled
        if (enableSound.value) {
          // Play spin-complete sound
          if (completeSound.value) {
            completeSound.value.currentTime = 0;
            completeSound.value.play().catch(e => console.error("Error playing sound:", e));
          } else {
            const audio = new Audio("/sounds/spin-complete.mp3");
            audio.play().catch(e => console.error("Error playing sound:", e));
          }
        }
        
        // Remove the winner from eligible tickets for the next draw
        const updatedSegments = segments.value.filter(
          segment => segment.ticket.number !== winningSegment.ticket.number
        );
        segments.value = updatedSegments;
        
        // Move to the next prize
        currentPrize.value++;
      }
    };
    
    requestAnimationFrame(animate);
  });

  // Function to download winners list
  const downloadWinners = $(() => {
    if (winners.value.length === 0) {
      toast.error(_`No winners yet to download`, {
        position: "top-center"
      });
      return;
    }

    let content = `${raffle.value.name || 'Raffle'} - Winners List\n\n`;
    
    winners.value.forEach((winner) => {
      const prize = raffle.value.prizes?.find(p => p.position === winner.prizeIndex);
      content += `Prize ${winner.prizeIndex}: ${prize?.name || 'Prize'}\n`;
      content += `Winner: Ticket #${winner.ticket.number}`;
      if (winner.ticket.buyerName) {
        content += ` - ${winner.ticket.buyerName}`;
      }
      if (winner.ticket.buyerPhone) {
        content += ` (${winner.ticket.buyerPhone})`;
      }
      content += '\n\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(raffle.value.name || 'Raffle').replace(/\s+/g, '_')}_winners.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(_`Winners list downloaded`, {
      position: "top-center"
    });
  });

  // Function to toggle fullscreen mode
  const toggleFullscreen = $(() => {
    isFullscreen.value = !isFullscreen.value;
    
    if (isFullscreen.value) {
      // Add class to body to prevent scrolling when in fullscreen
      document.body.classList.add('wheel-fullscreen-mode');
    } else {
      // Remove class when exiting fullscreen
      document.body.classList.remove('wheel-fullscreen-mode');
    }
  });

  if (raffle.value.failed) {
    return (
      <div class="p-4 max-w-7xl mx-auto">
        <h1 class="text-2xl font-bold text-purple-800">{_`Raffle not found`}</h1>
        <p class="text-purple-600">{_`The raffle you are looking for does not exist or has been deleted.`}</p>
      </div>
    );
  }

  const prizeCount = raffle.value.prizes?.length || 0;

  return (
    <div class={`wheel-page ${isFullscreen.value ? 'fullscreen-mode' : ''}`}>
      <div class="wheel-container">
        {!isFullscreen.value && (
          <div class="wheel-header">
            <Link href={`/raffle/${raffle.value.uuid}`}>
              <button class="back-button" onClick$={() => navigating.value = true}>
                <LuChevronLeft class="w-5 h-5" />
                <span>{_`Back to raffle`}</span>
                {navigating.value && <LuLoader2 class="w-5 h-5 animate-spin" />}
              </button>
            </Link>
            <h1>{raffle.value.name || _`Prize Draw`}</h1>
            <div class="header-actions">
              <button 
                class="action-button" 
                title={_`Fullscreen`}
                onClick$={toggleFullscreen}
              >
                <LuMaximize class="w-5 h-5" />
              </button>
              <SheetSettingsWheel position="right">Right</SheetSettingsWheel>
              <button 
                class="action-button"
                title={enableSound.value ? _`Mute Sound` : _`Enable Sound`}
                onClick$={() => enableSound.value = !enableSound.value}
              >
                {enableSound.value ? (
                  <LuVolume2 class="w-5 h-5" />
                ) : (
                  <LuVolumeX class="w-5 h-5" />
                )}
              </button>
              <button 
                class="action-button"
                title={_`Settings`}
                onClick$={() => showSettings.value = true}
              >
                <LuSettings class="w-5 h-5" />
              </button>
              <button 
                class="action-button"
                title={_`Download Results`}
                disabled={winners.value.length === 0}
                onClick$={downloadWinners}
              >
                <LuDownload class="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        <div class="wheel-body">
          {isFullscreen.value && (
            <div class="fullscreen-controls">
              <button 
                class="action-button fullscreen-action" 
                title={_`Exit Fullscreen`}
                onClick$={toggleFullscreen}
              >
                <LuMinimize class="w-5 h-5" />
              </button>
              <button 
                class="action-button fullscreen-action"
                title={enableSound.value ? _`Mute Sound` : _`Enable Sound`}
                onClick$={() => enableSound.value = !enableSound.value}
              >
                {enableSound.value ? (
                  <LuVolume2 class="w-5 h-5" />
                ) : (
                  <LuVolumeX class="w-5 h-5" />
                )}
              </button>
              <button 
                class="action-button fullscreen-action"
                title={_`Settings`}
                onClick$={() => showSettings.value = true}
              >
                <LuSettings class="w-5 h-5" />
              </button>
              {winners.value.length > 0 && (
                <button 
                  class="action-button fullscreen-action"
                  title={_`Download Results`}
                  onClick$={downloadWinners}
                >
                  <LuDownload class="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          <div class="wheel-main">
            <div class="wheel-controls">
              <div class="prize-status">
                {winners.value.length < prizeCount ? (
                  <div class="current-prize">
                    <LuTrophy class="w-5 h-5 trophy-icon" />
                    <span>
                      {_`Drawing prize ${currentPrize.value} of ${prizeCount}`}
                    </span>
                  </div>
                ) : (
                  <div class="all-prizes-drawn">
                    <div class="trophy-container">
                      <LuTrophy class="w-8 h-8 trophy-icon-large" />
                    </div>
                    <div>{_`All prizes have been drawn!`}</div>
                  </div>
                )}
              </div>
              
              {winners.value.length < prizeCount && (
                <button 
                  class="spin-button"
                  onClick$={spinWheel}
                  disabled={isSpinning.value || segments.value.length === 0}
                >
                  {isSpinning.value ? (
                    <div class="spin-loading">
                      <div class="spin-loading-text">{_`Spinning...`}</div>
                    </div>
                  ) : (
                    _`Spin the wheel!`
                  )}
                </button>
              )}
            </div>
            
            <div class="wheel-canvas-container">
              {/* Pin indicator above the wheel */}
              <div class="wheel-pin-indicator">
                <img src="/icons/pin-icon.svg" alt="Pin indicator" />
              </div>
              
              <canvas 
                id="wheel-canvas" 
                width={canvasSize.value} 
                height={canvasSize.value}
              ></canvas>
            </div>
          </div>

          {showSettings.value && (
            <div class="settings-panel">
              <div class="settings-header">
                <h3>{_`Wheel Settings`}</h3>
                <button onClick$={() => showSettings.value = false} class="close-settings">
                  <LuX class="w-4 h-4" />
                </button>
              </div>
              
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
            </div>
          )}
        </div>

        {winnerDisplayed.value && (
          <WinnerDisplay 
            winner={winnerDisplayed.value}
            prizePosition={currentPrize.value - 1}
            prizeName={raffle.value.prizes?.find(p => p.position === currentPrize.value - 1)?.name}
            onClose$={() => winnerDisplayed.value = null}
            onSpinAgain$={() => {
              winnerDisplayed.value = null;
              setTimeout(() => spinWheel(), 300);
            }}
            canSpinAgain={segments.value.length > 0 && currentPrize.value <= (raffle.value.prizes?.length || 0)}
          />
        )}

        {winners.value.length > 0 && (
          <div class="winners-section">
            <div class="winners-list">
              <h3>{_`Winners`}</h3>
              <div class="winners-grid">
                {winners.value.map((winner) => {
                  const prize = raffle.value.prizes?.find(p => p.position === winner.prizeIndex);
                  return (
                    <div key={winner.ticket.number} class="winner-card">
                      <div class="winner-card-header">
                        <LuTrophy class="trophy-icon-card w-5 h-5" />
                        <span class="prize-position">{_`Prize ${winner.prizeIndex}`}</span>
                      </div>
                      <div class="winner-card-prize">
                        {prize?.name || _`Prize`}
                      </div>
                      <div class="winner-card-ticket">
                        <span class="winner-number">#{winner.ticket.number}</span>
                        {winner.ticket.buyerName && (
                          <span class="winner-name">{winner.ticket.buyerName}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
