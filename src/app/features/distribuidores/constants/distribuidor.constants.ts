export const DISTRIBUIDOR_CONSTANTS = {
    ESTADOS: ['PENDIENTE', 'ENTREGADO', 'DEMORADO', 'CANCELADO'] as const,
    CANALES: ['TELEFONO', 'WEB', 'APP'] as const,
    TIEMPO_DEMORA_LIMITE: 30 // minutos
} as const;
