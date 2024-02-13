// in this file we will manage all the things related to users adding user. removing users , signing in , signing out everysingle thing

//....all the Helper Function we need in this.........//

const users = [];

const addUser = ({ id, name, room }) => {
  // these are the id , name , room of the user which we are destrcuting it

  // we want Bhupender Mehta  = bhupendermehta so we do this
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  // here we are finding that if the user is already exist so that we can give error to the new user
  const existingUser = users.find(
    (user) => user.name === name && user.room === room
  ); // this find method will us a boolean value that the user already exist or not
  if (existingUser) return { error: "Username is taken" };
  const user = { id, name, room }; // its an object shorthand
  console.log("user", user);
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id); // if this statement is true which means the id we are looking for exist and findIndex will return the index of the element if it find the element which satisfies the condition otherwise it returns -1
  if (index !== -1) {
    return users.splice(index, 1)[0]; // it will return the remove element  coz splice return the arryay and we want the result element only
  }
};

// const getUser = (id) => {
//   const currentUser = users.filter((user) => {
//     const result = user.id === id;
//     return result;
//   }); // it will basically return the user
//   return currentUser;
// };
const getUser = (id) => users.find((user) => user.id === id);

const getUserInRoom = (room) => {
  return users.filter((user) => user.room === room); // it return all the users from that room
};

module.exports = { addUser, removeUser, getUser, getUserInRoom }; // this is how you export function and variable module.exports is commonly used in Node.js for exporting multiple functions or variables as an object. and ES6 modules only used in FRONTEND DEV remember that
