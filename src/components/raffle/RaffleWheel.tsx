import { component$, useSignal, useStylesScoped$, $, useVisibleTask$, type QRL } from "@builder.io/qwik";
import { LuVolume2, LuVolumeX, LuTrophy, LuX } from "@qwikest/icons/lucide";
import type { Ticket } from "~/shared/indexedDB/config";
import styles from "./RaffleWheel.css?inline";
import { _ } from "compiled-i18n";

export interface RaffleWheelProps {
  eligibleTickets: Ticket[];
  numberOfPrizes: number;
  raffleName: string;
  onClose$: QRL<() => void>;
}

export default component$<RaffleWheelProps>(({ eligibleTickets, numberOfPrizes, raffleName, onClose$ }) => {
  useStylesScoped$(styles);

  // Señales para manejar el estado del componente
  const isSpinning = useSignal(false);
  const currentPrize = useSignal(1);
  const winners = useSignal<Array<{ ticket: Ticket; prizeIndex: number }>>([]);
  const remainingTickets = useSignal<Ticket[]>([...eligibleTickets]);
  const canvasSize = useSignal(Math.min(window.innerWidth * 0.7, 500));
  const showBuyerNames = useSignal(true);
  const enableSound = useSignal(true);
  const selectedColorScheme = useSignal<"rainbow" | "purple" | "blue">("purple");
  const rotationAngle = useSignal(0);
  const winnerDisplayed = useSignal<Ticket | null>(null);
  const confettiActivated = useSignal(false);

  const colorSchemes = {
    rainbow: ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"],
    purple: ["#F3E8FF", "#E9D5FF", "#D8B4FE", "#C084FC", "#A855F7", "#9333EA"],
    blue: ["#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB"]
  };

  // Lanzar confeti cuando hay un ganador
  const triggerConfetti = $(() => {
    if (typeof window !== "undefined" && (window as any).confetti) {
      const confetti = (window as any).confetti;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  });


  // Función para dibujar la rueda
  const drawWheel = $(() => {
    const canvas = document.getElementById("wheel-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const tickets = remainingTickets.value;
    if (tickets.length === 0) return;
    
    const sliceAngle = (2 * Math.PI) / tickets.length;
    const colors = colorSchemes[selectedColorScheme.value];
    
    // Dibujar las secciones de la rueda
    for (let i = 0; i < tickets.length; i++) {
      const startAngle = i * sliceAngle + rotationAngle.value;
      const endAngle = (i + 1) * sliceAngle + rotationAngle.value;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Alternar colores
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Añadir texto (número de boleto y nombre si está habilitado)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#4B5563";
      ctx.font = `bold ${radius / 15}px sans-serif`;
      
      const ticket = tickets[i];
      let text = `#${ticket.number}`;
      if (showBuyerNames.value && ticket.buyerName) {
        text += ` - ${ticket.buyerName}`;
      }
      
      // Limitar el texto para que no sea demasiado largo
      if (text.length > 15) {
        text = text.substring(0, 15) + "...";
      }
      
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    }
    
    // Dibujar el círculo central
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#9333EA";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Dibujar el puntero
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 10);
    ctx.lineTo(centerX - 10, centerY - radius + 10);
    ctx.lineTo(centerX + 10, centerY - radius + 10);
    ctx.closePath();
    ctx.fillStyle = "#9333EA";
    ctx.fill();
  });

  // Inicializar la rueda y cargar la librería de confeti
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    // Cargar el script de confeti
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
    document.body.appendChild(script);

    // Ajustar tamaño en cambio de ventana
    const handleResize = () => {
      canvasSize.value = Math.min(window.innerWidth * 0.7, 500);
    };
    window.addEventListener("resize", handleResize);

    // Inicializar la rueda
    drawWheel();

    cleanup(() => {
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(script);
    });
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => [
      remainingTickets.value,
      canvasSize.value,
      showBuyerNames.value,
      selectedColorScheme.value,
      rotationAngle.value
    ]);
    drawWheel();
  });

  // Función para girar la rueda y seleccionar un ganador
  const spinWheel = $(async () => {
    if (isSpinning.value || remainingTickets.value.length === 0) return;
    
    // Reiniciar el ganador mostrado
    winnerDisplayed.value = null;
    confettiActivated.value = false;
    
    // Comprobar si queda algún premio por sortear
    if (currentPrize.value > numberOfPrizes) {
      return;
    }
    
    isSpinning.value = true;
    
    // Reproducir sonido si está habilitado
    if (enableSound.value) {
      const audio = new Audio("/sounds/wheel-spin.mp3");
      audio.play().catch(e => console.error("Error playing sound:", e));
    }
    
    // Seleccionar un ganador aleatorio
    const randomIndex = Math.floor(Math.random() * remainingTickets.value.length);
    const winningTicket = remainingTickets.value[randomIndex];
    
    // Calcular el ángulo al que debe detenerse la rueda
    const sliceAngle = (2 * Math.PI) / remainingTickets.value.length;
    const targetAngle = -(randomIndex * sliceAngle);
    const fullRotations = 4; // Número de rotaciones completas antes de detenerse
    const finalAngle = targetAngle - fullRotations * 2 * Math.PI;
    
    // Animar la rueda
    const startTime = Date.now();
    const duration = 5000; // Duración de la animación en ms
    const initialAngle = rotationAngle.value;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed < duration) {
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3); // Función de ease-out cúbica
        const progress = easeOut(elapsed / duration);
        rotationAngle.value = initialAngle + progress * (finalAngle - initialAngle);
        requestAnimationFrame(animate);
      } else {
        rotationAngle.value = finalAngle;
        isSpinning.value = false;
        
        // Guardar el ganador
        winners.value = [...winners.value, { ticket: winningTicket, prizeIndex: currentPrize.value - 1 }];
        
        // Eliminar el boleto ganador de los boletos restantes
        remainingTickets.value = remainingTickets.value.filter(t => t.number !== winningTicket.number);
        
        // Mostrar el ganador
        winnerDisplayed.value = winningTicket;
        
        // Activar confeti
        confettiActivated.value = true;
        setTimeout(() => {
          triggerConfetti();
        }, 300);
        
        // Reproducir sonido de victoria si está habilitado
        if (enableSound.value) {
          const winAudio = new Audio("/sounds/win-sound.mp3");
          winAudio.play().catch(e => console.error("Error playing win sound:", e));
        }
        
        // Avanzar al siguiente premio
        currentPrize.value++;
      }
    };
    
    requestAnimationFrame(animate);
  });

  // Función para volver a sortear
  const restartDraw = $(() => {
    winners.value = [];
    remainingTickets.value = [...eligibleTickets];
    currentPrize.value = 1;
    rotationAngle.value = 0;
    winnerDisplayed.value = null;
    confettiActivated.value = false;
  });

  return (
    <div class="raffle-wheel-container">
      <div class="wheel-header">
        <h2>{_`Sorteo de premios - ${raffleName}`}</h2>
        <button onClick$={onClose$} class="close-button">
          <LuX />
        </button>
      </div>

      <div class="wheel-content">
        <div class="wheel-controls">
          <div class="wheel-options">
            <div class="option-group">
              <label>
                <input
                  type="checkbox" 
                  checked={showBuyerNames.value}
                  onChange$={() => showBuyerNames.value = !showBuyerNames.value}
                />
                {_`Mostrar nombres de compradores`}
              </label>
            </div>
            
            <div class="option-group">
              <span>{_`Esquema de colores:`}</span>
              <div class="color-schemes">
                <button 
                  class={{
                    'color-scheme-btn': true, 
                    'rainbow': true,
                    'selected': selectedColorScheme.value === 'rainbow'
                  }}
                  onClick$={() => selectedColorScheme.value = 'rainbow'}
                ></button>
                <button 
                  class={{
                    'color-scheme-btn': true, 
                    'purple': true,
                    'selected': selectedColorScheme.value === 'purple'
                  }}
                  onClick$={() => selectedColorScheme.value = 'purple'}
                ></button>
                <button 
                  class={{
                    'color-scheme-btn': true, 
                    'blue': true,
                    'selected': selectedColorScheme.value === 'blue'
                  }}
                  onClick$={() => selectedColorScheme.value = 'blue'}
                ></button>
              </div>
            </div>
            
            <div class="option-group">
              <label>
                <input
                  type="range"
                  min="200"
                  max={Math.min(window.innerWidth * 0.8, 700)}
                  value={canvasSize.value}
                  onChange$={(e: any) => canvasSize.value = parseInt(e.target.value)}
                />
                {_`Tamaño de la rueda: ${canvasSize.value}px`}
              </label>
            </div>
            
            <div class="option-group">
              <button 
                onClick$={() => enableSound.value = !enableSound.value}
                class="sound-toggle"
              >
                {enableSound.value ? <LuVolume2 /> : <LuVolumeX />}
                {enableSound.value ? _`Sonido activado` : _`Sonido desactivado`}
              </button>
            </div>
          </div>
          
          <div class="prize-status">
            {currentPrize.value <= numberOfPrizes ? (
              <div class="current-prize">
                <LuTrophy class="trophy-icon" />
                <span>{_`Sorteando premio ${currentPrize.value} de ${numberOfPrizes}`}</span>
              </div>
            ) : (
              <div class="all-prizes-drawn">
                <span>{_`¡Todos los premios han sido sorteados!`}</span>
                <button onClick$={restartDraw} class="restart-button">
                  {_`Volver a sortear`}
                </button>
              </div>
            )}
          </div>
          
          {remainingTickets.value.length > 0 && currentPrize.value <= numberOfPrizes && (
            <button 
              onClick$={spinWheel} 
              class="spin-button"
              disabled={isSpinning.value}
            >
              {isSpinning.value ? _`Girando...` : _`¡Girar la rueda!`}
            </button>
          )}
        </div>
        
        <div class="wheel-wrapper">
          <canvas 
            id="wheel-canvas" 
            width={canvasSize.value} 
            height={canvasSize.value}
            style={{ width: `${canvasSize.value}px`, height: `${canvasSize.value}px` }}
          ></canvas>
          
          {winnerDisplayed.value && confettiActivated.value && (
            <div class="winner-display">
              <h3>{_`¡Ganador del premio ${winners.value.length}!`}</h3>
              <div class="winner-info">
                <div class="winner-number">#{winnerDisplayed.value.number}</div>
                {winnerDisplayed.value.buyerName && (
                  <div class="winner-name">{winnerDisplayed.value.buyerName}</div>
                )}
                {winnerDisplayed.value.buyerPhone && (
                  <div class="winner-phone">{winnerDisplayed.value.buyerPhone}</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {winners.value.length > 0 && (
          <div class="winners-list">
            <h3>{_`Ganadores`}</h3>
            <ul>
              {winners.value.map((winner, index) => (
                <li key={index} class="winner-item">
                  <div class="winner-prize-number">{_`Premio ${index + 1}`}</div>
                  <div class="winner-ticket-info">
                    <span class="ticket-number">#{winner.ticket.number}</span>
                    {winner.ticket.buyerName && (
                      <span class="buyer-name">{winner.ticket.buyerName}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}); 