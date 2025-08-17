import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "../lib/prisma";
import { ActiveUser, ChatMessageData } from "../types";

// store active users, maybe later move to redis
let activerUsers: ActiveUser[] = [];
