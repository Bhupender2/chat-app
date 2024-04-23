import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";

export default function Join() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Chatify</h1>
        <div>
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Room"
            className="joinInput mt-20"
            type="text"
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <Link
          to={`/chat?name=${name}&room=${room}`}
          onClick={(e) => (!name || !room ? e.preventDefault() : null)}
        >
          {" "}
          {/* genertaing onClick event listener so that if there is no name or no room it shoulld not be able to enter the chatroom */}
          <button className="button mt-20" type="submit">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
}
