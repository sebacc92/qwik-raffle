import * as v from 'valibot'

export const TicketSchema = v.pipe(
  v.object({
    raffleId: v.number(),
    number: v.optional(v.number()),
    numbers: v.optional(v.array(v.number())),
    buyerName: v.pipe(
      v.string("El nombre debe ser una cadena"),
      v.minLength(2, "El nombre debe tener al menos 2 caracteres"),
    ),
    buyerPhone: v.optional(v.string("El teléfono debe ser una cadena")),
    notes: v.optional(v.string("Las notas deben ser una cadena")),
    status: v.pipe(
      v.string("El estado debe ser una cadena"),
      v.minLength(1, "El estado es obligatorio")
    )
  }),
);

export type TicketForm = v.InferInput<typeof TicketSchema>;

export interface TicketResponseData {
  success: boolean;
  message: string;
  data?: {
    ticket_id?: number;
    updated_count?: number;
  };
} 