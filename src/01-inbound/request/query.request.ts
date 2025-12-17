import { z } from "zod";

export const querySchema = z.object({
  offset: z.coerce
    .number({ message: "offset이 유효하지 않습니다" })
    .default(0)
    .optional(),
  limit: z.coerce.number().default(10).optional(),
  search: z.string().optional().default("").optional(),
  sort: z.string().optional().default("desc").optional(),
});

export type QueryType = z.infer<typeof querySchema>;
