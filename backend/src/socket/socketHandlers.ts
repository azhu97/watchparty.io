import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "../lib/prisma";
import { ActiveUser, ChatMessageData } from "../types";

// store active users, maybe later move to redis
let activeUsers: ActiveUser[] = [];

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
        activeUsers.push(updatedUser);
        console.log(`${updatedUser.username} joined on socket. `);

        // send games to the new user
        const games = await prisma.game.findMany({
          orderBy: { gameDate: "desc" },
        });
        socket.emit("games-update", games);

        // send user count to the client
        socket.emit("users-online", activeUsers.length);
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
    console.log(`User ${socket.id} has left game ${gameId}`);
  });

  // handle chat messages
  socket.on("chat-message", async (data: ChatMessageData) => {
    try {
      const { gameId, message, userId } = data;

      // save the message in the data base
      const chatMessage = await prisma.chatMessage.create({
        data: { message, gameId, userId },
        include: { user: { select: { username: true } } },
      });

      io.to(`game-${gameId}`).emit("chat-message", chatMessage);
    } catch (error) {
      console.error("Error saving chat message: ", error);
    }
  });
  
  // handle disconnects 
  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter(user => user.socketId !== socket.id);
    io.emit('users-online', activeUsers.length);
    console.log("User disconnected: ", socket.id)
  })
};

// live game updates (currently randomly updates not accurate but use for mock data)
export const startLiveGameUpdates = (io: SocketIOServer) => {
  setInterval(async () => {
    try {
      const liveGames = await prisma.game.findMany({
        where: { status: 'LIVE' }
      });
      
      for (const game of liveGames) {
        // Randomly update scores
        if (Math.random() > 0.7) {
          const homeScoreIncrease = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0;
          const awayScoreIncrease = homeScoreIncrease === 0 ? Math.floor(Math.random() * 3) + 1 : 0;
          
          // Update time
          const [minutes, seconds] = game.timeLeft.split(':').map(Number);
          let newSeconds = seconds - 1;
          let newMinutes = minutes;
          
          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes -= 1;
          }
          
          if (newMinutes >= 0) {
            const updatedGame = await prisma.game.update({
              where: { id: game.id },
              data: {
                homeScore: game.homeScore + homeScoreIncrease,
                awayScore: game.awayScore + awayScoreIncrease,
                timeLeft: `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`
              }
            });
            
            // Broadcast updated game to all users in that game room
            io.to(`game-${game.id}`).emit('game-update', updatedGame);
          }
        }
      }
    } catch (error) {
      console.error('Error updating live games:', error);
    }
  }, 3000); // Update every 3 seconds
};

