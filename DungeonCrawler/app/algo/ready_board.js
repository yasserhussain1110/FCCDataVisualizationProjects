
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