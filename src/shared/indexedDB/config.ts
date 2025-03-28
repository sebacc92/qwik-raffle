// Definimos las interfaces
export interface Prize {
    id?: number;
    raffleId: number;
    name: string;
    createdAt: string;
}

export interface LocalRaffle {
    id?: number;
    name: string;
    description: string;
    numberCount: number;
    pricePerNumber: number;
    createdAt: string;
    updatedAt: string;
    uuid: string;
    prizes?: Prize[];  // Hacemos los premios opcionales
}

export interface Ticket {
    id?: number;
    raffleId: number;
    number: number;
    status: "unsold" | "sold-unpaid" | "sold-paid";
    buyerName: string | null;
    buyerPhone: string | null;
    paymentStatus: boolean;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

// Configuración de la base de datos
export const DB_NAME = 'GuestRafflesDB';
export const DB_VERSION = 3;

// Función para abrir la conexión a IndexedDB
export const openDB = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(new Error('Error opening the database'));

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            
            // Store para sorteos
            if (!db.objectStoreNames.contains('raffles')) {
                const raffleStore = db.createObjectStore('raffles', { keyPath: 'id', autoIncrement: true });
                raffleStore.createIndex('createdAt', 'createdAt', { unique: false });
                raffleStore.createIndex('uuid', 'uuid', { unique: true });
            }
            
            // Store para tickets
            if (!db.objectStoreNames.contains('tickets')) {
                const ticketStore = db.createObjectStore('tickets', { keyPath: 'id', autoIncrement: true });
                ticketStore.createIndex('raffleId', 'raffleId', { unique: false });
                ticketStore.createIndex('number', 'number', { unique: false });
                ticketStore.createIndex('raffleId_number', ['raffleId', 'number'], { unique: true });
            }

            // Store para premios
            if (!db.objectStoreNames.contains('prizes')) {
                const prizeStore = db.createObjectStore('prizes', { keyPath: 'id', autoIncrement: true });
                prizeStore.createIndex('raffleId', 'raffleId', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };
    });
}; 