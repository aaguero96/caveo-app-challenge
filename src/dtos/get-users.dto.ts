export interface GetUsersQueryDto {
  page?: number;
  itemsPerPage?: number;
}

export interface GetUsersResponseDto {
  users?: {
    id: string;
    name: string;
    isOnboarded: boolean;
    createdAt: Date;
    updatedAt?: Date;
  }[];
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
