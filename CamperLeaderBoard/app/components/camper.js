import React from 'react';

export default ({index, camper}) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td className="camper-name"><a href={"https://www.freecodecamp.com/" + camper.username}>
        <img className="userimg" src={camper.img}/>{camper.username}
      </a>
      </td>
      <td className="camper-recent">{camper.recent}</td>
      <td className="camper-alltime">{camper.alltime}</td>
    </tr>
  );
};