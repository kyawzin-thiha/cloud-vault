import { Storage, Token, User } from '@prisma/client';

export type UserDto = User | null;

export type StorageDto = Storage | null;
export type StoragesDto = Storage[] | null;

export type TokenDto = Token & {user: User} | null;