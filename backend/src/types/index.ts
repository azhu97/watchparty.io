import { User, ChatMessage } from "@prisma/client";


export { Game, GameStatus } from "@prisma/client";

export interface ExtendedUser extends User {
  socketId?: string;
}

export interface ExtendedChatMessage extends ChatMessage {
  user: { username: string }; // Include user info for chat display
}

export interface AuthResponse {
  user: Omit<ExtendedUser, "password">;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface JoinGameData {
  gameId: number;
  username: string;
}

export interface ChatMessageData {
  gameId: number;
  message: string;
  userId: number;
}

export interface ActiveUser extends Omit<ExtendedUser, "password"> {
  socketId: string;
}

export interface JwtUserPayload {
  id: number;
  username: string;
}

export interface WatchPartyData {
  gameId: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  maxUsers?: number;
}
