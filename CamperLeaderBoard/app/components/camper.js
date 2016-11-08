import React from 'react';

export default ({index, camper}) => {
  return (
    <tr>
      <td>{index+1}</td>
      <td><a href={"https://www.freecodecamp.com/"+camper.username}>
        <img className="userimg" src={camper.img} />{camper.username}
        </a>
      </td>
      <td>{camper.recent}</td>
      <td>{camper.alltime}</td>
    </tr>
  );
};