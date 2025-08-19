import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "../lib/prisma";
import { ActiveUser, ChatMessageData } from "../types";
import { findPackageJSON } from "module";

// store active users, maybe later move to redis
let activerUsers: ActiveUser[] = [];

export const handleConnection = (io: SocketIOServer, socket: Socket) => {
  console.log("Connecting User: ", socket.id);

  // handle user joining
  socket.on("join", async (userData: { userId: number }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userData.userId },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // check if the user is valid, if so push into the stack
      if (user) {
        const updatedUser: ActiveUser = { ...user, socketId: socket.id };
        activerUsers.push(updatedUser);
        console.log(`${updatedUser.username} joined on socket. `);

        // send games to the new user
        const games = await prisma.game.findMany({
          orderBy: { gameDate: "desc" },
        });
        socket.emit("games-update", games);

        // send user count to the client
        socket.emit("users-online", activerUsers.length);
      }
    } catch (error) {
      console.error("Error joining socket: ", error);
    }
  });

  // handle joining game room for live updates
  socket.on("join-game", (gameId: number) => {
    socket.join(`game-${gameId}`);
    console.log(`User ${socket.id} has joined game ${gameId}`);
  });

  // handle leaving game room
  socket.on("leave-game", (gameId: number) => {
    socket.leave(`game-${gameId}`);
    console.log(`User ${socket.id} has left game ${gameId}`)
  });

  // handle chat messages 
  socket.on('chat-message', )
};
