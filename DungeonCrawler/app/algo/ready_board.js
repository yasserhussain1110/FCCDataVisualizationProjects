
/*
  rooms = get_rooms_of_random_orientations(number_of_rooms = 20)
  unplaced_rooms = rooms;
  placed_rooms = [];
  connections_between_rooms = [];

  a_room = select_a_random_room(list_of_rooms = unplaced_rooms)
  place_room_on_board(room = a_room)
  placed_rooms.add(room = a_room)
  unplaced_rooms.remove(room = a_room)

  while (unplaced_rooms.length != 0) {
    room1 = select_a_random_room(list_of_rooms = placed_rooms)
    room2 = select_a_random_room(list_of_rooms = unplaced_rooms)

    repeat(10 times) {
      outcome = try_to_create_connection_at_a_random_place_between_rooms(room1 = room1, room2 = room2);
      if (outcome.isSuccessful()) {
        connections_between_rooms.add(connection = outcome.getConnection());
        placed_rooms.add(room = room1)
        placed_rooms.add(room = room2)

        unplaced_rooms.remove(room = room1)
        unplaced_rooms.remove(room = room2)
        break;
      }
    }
  }
*/

/*
room = {
  origin: [],
  width: 0,
  height: 0
};
*/


const ready_rooms = () => {
  var rooms = get_random_rooms(20, 25, 25);
  rooms[0].origin = [0,0];

  for (var i=1; i<rooms.length; i++) {
    rooms[i].origin = [rooms[i-1].origin[0] + rooms[i-1].height + 1, 0];
  }
  return rooms;
};

const get_random_rooms = (number_of_rooms, max_height, max_width) => {
  var rooms = [];
  for (var i=0; i<number_of_rooms; i++) {
    rooms.push({
      width: random(1, max_width),
      height: random(1, max_height)
    });
  }
  return rooms;
};

const random = (lower_limit, upper_limit) => (
  ((Math.random() * (upper_limit - lower_limit + 1)) | 0) + lower_limit
);

export default ready_rooms;
