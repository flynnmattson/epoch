var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');
var socketRedis = require('socket.io-redis');
var env = process.env.NODE_ENV || 'local';
var Game = require('./game');
var redisClient = redis.createClient(6379, 'redis');

io.adapter(socketRedis({host: 'redis', port: 6379}));
var rooms = {},
    roomCount = 0;

//blash
io.on('connection', function(socket){
  console.log("Player Connected: "+socket.id);
  for(var roomId in rooms){
    if(!socket.roomId && rooms[roomId].playerTwo.id === null){
      console.log("Found a Preexisting Room! "+roomId);
      socket.roomId = roomId;
      socket.join(roomId, function(){
        rooms[roomId].prepareGame(socket.id).then(function(){
          // Send Game Info to First player that is waiting for Game.
          socket.broadcast.to(rooms[roomId].playerOne.id).emit('startGame',
            'Opponent Found! Game has begun and it is your turn...',
            {
              marketResources : rooms[roomId].marketResources,
              marketHand : rooms[roomId].marketHand,
              playerStats : rooms[roomId].playerOne
            }
          );
          // Send Game Info to Second Player who just joined.
          socket.emit('startGame',
            'Opponent Found! Game has begun and it is your Opponent\'s turn...',
            {
              marketResources : rooms[roomId].marketResources,
              marketHand : rooms[roomId].marketHand,
              playerStats : rooms[roomId].playerTwo
            }
          );
        });
        return;
      });
    }
  }
  // Game has not been found so creating for a new room and waiting for
  // an opponent
  if(!socket.roomId){
    console.log("Creating a new Room!");
    var roomId = 'room'+roomCount++;
    socket.roomId = roomId;
    socket.join(roomId, function(){
      socket.emit('waitForOpponent');
      rooms[roomId] = new Game(socket.id);
    });
  }

  socket.on('disconnect', function(){
    var thisPlayer = null,
        opponentPlayer = null;
    console.log("Player Disconnected!");
    for(var roomId in rooms){
      thisPlayer = (socket.id === rooms[roomId].playerOne.id ? rooms[roomId].playerOne :
                    (socket.id === rooms[roomId].playerTwo.id ? rooms[roomId].playerTwo : null));
      opponentPlayer = (thisPlayer.id === rooms[roomId].playerOne.id ? rooms[roomId].playerTwo : rooms[roomId].playerOne);
      if(thisPlayer){
        if(!opponentPlayer.id || opponentPlayer.disconnected){
          console.log("Removing Game!");
          delete rooms[roomId];
        }else{
          socket.broadcast.to(opponentPlayer.id).emit('playerDisconnected');
          thisPlayer.disconnected = true;
        }
        return;
      }
    }
  });

  socket.on('action', function(playerHand, marketHand){
    rooms[socket.roomId].takeAction(socket.id, playerHand, marketHand)
      .then(function(result){
        result.opponentPlayer.stats.turn = true;
        result.thisPlayer.stats.turn = false;
        socket.broadcast.to(result.opponentPlayer.stats.id).emit(
          'actionSuccess',
          result.opponentPlayer.message+' It is now your turn!',
          {
            marketResources : rooms[socket.roomId].marketResources,
            marketHand : rooms[socket.roomId].marketHand,
            playerStats : result.opponentPlayer.stats
          }
        );
        socket.emit(
          'actionSuccess',
          result.thisPlayer.message+' It is now your Opponent\'s turn...',
          {
            marketResources : rooms[socket.roomId].marketResources,
            marketHand : rooms[socket.roomId].marketHand,
            playerStats : result.thisPlayer.stats
          }
        );
      }).catch(function(err){
        socket.emit('actionFail', err);
      });
  });

  // io.of('/epoch').adapter.clients(function(err, clients){
  //   console.log(clients);
  // });
});

server.listen(3001, function(){
  console.log("Server is now running...");
});
