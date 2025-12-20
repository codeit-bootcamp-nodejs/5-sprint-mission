import z from "zod";

export type MarkAsReadDto = z.infer<typeof markAsReadReqSchema>;
export type GetUnreadCountDto = z.infer<typeof getUnreadCountReqSchema>;
export type GetMyNotificationsDto = z.infer<typeof getMyNotificationsReqSchema>;

export const markAsReadReqSchema = z.object({
  notificationId: z.number(),
  userId: z.string(),
});

export const getUnreadCountReqSchema = z.object({
  userId: z.string(),
});

export const getMyNotificationsReqSchema = z.object({
  userId: z.string(),
  offset: z.number().default(0),
  limit: z.number().default(5),
}).transform((data) => ({
  ...data,
}));