import z from 'zod';

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  itemsPerPage: z.coerce.number().optional().default(10),
});
export type GetUsersQueryDto = z.infer<typeof getUsersQuerySchema>;

export interface GetUsersResponseDto {
  users?: {
    id: string;
    name?: string | undefined;
    isOnboarded: boolean;
    createdAt: Date;
    updatedAt?: Date | undefined;
  }[];
  page: number;
  itemsInPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
