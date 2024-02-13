const express = require("express"); // we are in the node not in react so we have to do imports like this using require
const socketio = require("socket.io");

const http = require("http"); // we need a node build in modules= which is http

const { addUser, removeUser, getUser, getUserInRoom } = require("./users.js");

const cors = require("cors"); // Import the cors middleware

const PORT = process.env.PORT || 5000; // we can use 5000 only but during deployment we can have to defined a specific port which is inside process.env.port

const router = require("./router"); // importing the router here

const app = express(); // app that we inialised from express

const server = http.createServer(app); // we are passing the app that we initialised from the express

//const io = socketio(server); // we are creating an instance and passing the server inside the instance we created
// app.use(
//   cors()
// );

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // this socket is going to be connected as client side socket

  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room, "..........");
    // we can use that callback in socket.on event
    const { error, user } = addUser({ id: socket.id, name, room }); // we are getting data on the backend

    if (error) return callback(error); // if error we will simply return callback with error and this error is coming from addUser function error statement

    // now someone join so there is system messages when someone join the team
    socket.emit("message", {
      user: "admin",
      text: `${user.name} , Welcome to the room ${user.room}`,
    });

    // socket.broadcast will tell everyone in that room beside that user that it has join the room
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!!!` });

    // here we emmited message from the backend to the frontend using socket.emit()
    // now if there is no error then we use socket.join that simply that user has join the room
    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    }); //--------------new code-----
    callback(); // but it will not run if there is no error

    // const error = true;
    // if (error) {
    //   callback({ error: "error" }); // what this will do is it will trigger some response immediately after socket.on event is emmited and we can do some error handling with this callBack
    // }
  });

  socket.on("sendMessage", (message, callBack) => {
    const user = getUser(socket.id); // we will get the user who sends the message from the frontend
    console.log("user line70", user);
    console.log("user?.room", user[0]?.room);
    io.to(user?.room).emit("message", {
      user: user?.name,
      text: message,
    }); // what we are getting from the frontend
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });

    callBack(); // so that we can do something after the message is send
  }); // now we are waiting for the frontend to send message this callback will run after the event(sendMessage) is occur

  // socket.on("disconnect", () => {
  //   console.log("user has left!!!");
  // });
  //-----------------new disconnect code------
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      // io.to(user.room).emit("roomData", {
      //   room: user.room,
      //   users: getUsersInRoom(user.room ),
      // });
    }
  });
});

app.use(router); // we can now call it as middleware

// starting the server now

server.listen(PORT, () => {
  console.log(`Server has Started ${PORT}`);
});
