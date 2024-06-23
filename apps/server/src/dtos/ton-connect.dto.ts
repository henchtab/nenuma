import z from 'zod';
import { CHAIN } from '@/constants';

export const checkProofRequestSchema = z.object({
  address: z.string(),
  network: z.nativeEnum(CHAIN),
  public_key: z.string(),
  proof: z.object({
    timestamp: z.number(),
    domain: z.object({
      lengthBytes: z.number(),
      value: z.string(),
    }),
    payload: z.string(),
    signature: z.string(),
    state_init: z.string(),
  }),
});

export type CheckProofRequestDto = z.infer<typeof checkProofRequestSchema>;
