import React, { useState, useEffect } from "react"; //useEffect is basically for lifeCycle method inside the hook

import queryString from "query-string"; // this module help us in retrieving from the Url
import { useLocation } from "react-router";

import io from "socket.io-client";
import "./Chat.css";

let socket;

export default function Chat() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState(""); // to specify every single message
  const [messages, setMessages] = useState([]); // keep track of all the messages
  const ENDPOINT = "http://localhost:5000";
  const location = useLocation(); //we dont pass it as a prop now ..now we use useLocation() instead of passing it as a prop
  // this is coming from react router and we are recieving it as a prop
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
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, [messages]); // only run this when messages array changes

  // function for sending messages
  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage("")); // after message is send it will clear the input field
    }
  };
  console.log(message, messages); // lets see the messages

  return (
    <div className="outerContainer">
      <div className="container">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
        />
      </div>
    </div>
  );
}
