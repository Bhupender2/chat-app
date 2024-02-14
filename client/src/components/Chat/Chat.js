import React, { useState, useEffect } from "react"; //useEffect is basically for lifeCycle method inside the hook

import queryString from "query-string"; // this module help us in retrieving from the Url
import { useLocation } from "react-router";

import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket;

export default function Chat() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState(""); // to specify every single message
  const [messages, setMessages] = useState([]); // keep track of all the messages
  const ENDPOINT = "https://react-chat-app-q3el.onrender.com/";
  const location = useLocation(); //we dont pass it as a prop now ..now we use useLocation() instead of passing it as a prop
  // this is coming from react router and we are recieving it as a prop
  console.log(users)
  useEffect(() => {
    const { name, room } = queryString.parse(location.search); // it will give us the credentials that we input

    //when we get our first connection we gonna set that socket to io(END_POINT)
    socket = io(ENDPOINT, {
      transports: ["websocket", "polling", "flashsocket"],
    });
    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, () => {
      // we can anythinh from the client side which backend can recoginize
    });
    return () => {
      // this will happen on unMounting on leaving the chat
      socket.disconnect(); // disconnect is the reserved keyowrd so we use this
      socket.off(); // it will off it per user
    };

    // console.log(name, room);
    // console.log(location.search); // it will only give us the parameter not the full url
  }, [ENDPOINT, location.search]); // Ensure useEffect runs when the value in this array changes only then it will rerender the useEffect otherwise not

  useEffect(() => {
    // this useEffect is for handling messages
    socket.once("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

  }, [messages]); // only run this when messages array changes

  // function for sending messages
  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage("")); // after message is send it will clear the input field
    }
  };
  //  console.log(message," ---this is the message we are typing"); // lets see the messages
  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
        {/* <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
        /> */}

      </div>
      <TextContainer users={users}/>
    </div>
  );
}
