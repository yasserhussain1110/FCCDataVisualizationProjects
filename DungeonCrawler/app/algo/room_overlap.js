const is_vertical = (side) => (side[0].col === side[1].col);

const get_all_sides = (room) => {
  var origin_corner = room.origin;
  var origin_down_corner = {
    row: room.origin.row + room.height - 1,
    col: room.origin.col
  };
  var origin_right_corner = {
    row: room.origin.row,
    col: room.origin.col + room.width - 1
  };
  var origin_opposite_corner = {
    row: room.origin.row + room.height,
    col: room.origin.col + room.width - 1
  };

  return [[origin_corner, origin_down_corner],
    [origin_corner, origin_right_corner],
    [origin_down_corner, origin_opposite_corner],
    [origin_right_corner, origin_opposite_corner]
  ];
};

const get_all_corners = (room) => {
  var origin_corner = room.origin;
  var origin_down_corner = {
    row: room.origin.row + room.height - 1,
    col: room.origin.col
  };
  var origin_right_corner = {
    row: room.origin.row,
    col: room.origin.col + room.width - 1
  };
  var origin_opposite_corner = {
    row: room.origin.row + room.height,
    col: room.origin.col + room.width - 1
  };

  return [origin_corner, origin_down_corner, origin_right_corner, origin_opposite_corner];
};


const does_any_corner_of_room_touch_another_room = (corners, room) => {
  //var corners = get_all_corners(room2);
  for (var i = 0; i < corners.length; i++) {
    var c = corners[i];
    if (room.origin.row - 1 <= c.row && c.row <= room.origin.row + room.height
      &&
      room.origin.col - 1 <= c.col && c.col <= room.origin.col + room.width) {
      return true;
    }
  }
  return false;
};

const does_any_sides_of_room_cut_any_other_side_of_room = (room1, room2) => {
  var room1_sides = get_all_sides(room1);
  var room2_sides = get_all_sides(room2);

  for (var i = 0; i < room1_sides.length; i++) {
    for (var j = 0; j < room2_sides.length; j++) {
      if (do_sides_cut(room1_sides[i], room2_sides[j])) {
        return true;
      }
    }
  }
  return false;
};


const do_sides_cut = (side1, side2) => {
  var is_side1_vertical = is_vertical(side1);
  var is_side2_vertical = is_vertical(side2);

  if (is_side1_vertical === is_side2_vertical) {
    return false;
  }

  if (is_side1_vertical) {
    return side2[0].col < side1[0].col && side1[0].col < side2[1].col
      && side1[0].row < side2[0].row && side2[0].row < side1[1].row;
  } else {
    // side2 is vertical here
    // side1 is horizontal here
    return side1[0].col < side2[0].col && side2[0].col < side1[1].col
      && side2[0].row < side1[0].row && side1[0].row < side2[1].row;
  }
};


const do_rooms_overlap_or_touch = (room1, room2) => {
  var corners_of_room2 = get_all_corners(room2);
  var corners_of_room1 = get_all_corners(room1);

  return does_any_corner_of_room_touch_another_room(corners_of_room2, room1)
  ||
  does_any_corner_of_room_touch_another_room(corners_of_room1, room2)
  ||
  does_any_sides_of_room_cut_any_other_side_of_room(room1, room2);
};

//do_rooms_overlap_or_touch({ origin: {row: 72, col: 34}, height: 10, width: 15}, {origin: {row: 58, col: 48}, height:25, width:6});
//do_rooms_overlap_or_touch({ origin: {row: 86, col: 12}, height: 15, width: 34}, {origin: {row: 88, col: 46}, height:12, width:21});

export default do_rooms_overlap_or_touch;