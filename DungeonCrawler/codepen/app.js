const move = (key, gameState) => {
  var tentative_position = get_tentative_position(key, gameState.player.position);
  var collision_result;

  if (collision_result = is_collision(tentative_position, gameState.enemies,
      gameState.weapons, gameState.healths, gameState.transporter, gameState.boss)) {

    return take_action_based_on_collision_type(collision_result, gameState);


  } else {
    var new_player_object =
      try_to_move(tentative_position, gameState.player, gameState.dungeon.rooms, gameState.dungeon.connection_cells);

    return {
      player: new_player_object
    };
  }
};

const try_to_move = (tentative_position, player, rooms, connection_cells) => {
  if (player.connection_cell) {
    var rooms_having_connection_cell = get_rooms_having_connection_cell(rooms, player.connection_cell);
    var room = position_in_which_of_two_rooms(tentative_position, rooms_having_connection_cell[0], rooms_having_connection_cell[1]);

    if (!room) {
      // No change. Not a valid move.
      return player;
    }

    player.connection_cell = null;
    player.room = room;
    player.position = tentative_position;
    return player;

  } else if (player.room) {
    if (is_position_in_room(tentative_position, player.room)) {
      player.position = tentative_position;
      return player;
    } else if (is_position_one_of_connection_cells(tentative_position, connection_cells)) {
      player.connection_cell = tentative_position;
      player.position = tentative_position;
      player.room = null;
      return player;
    } else {
      // No change. Not a valid move.
      return player;
    }
  }
};

const get_tentative_position = (actionKey, player_position) => {
  var row = player_position.row;
  var col = player_position.col;

  switch (actionKey) {
    case "ArrowLeft":
      col--;
      break;
    case "ArrowRight":
      col++;
      break;
    case "ArrowUp":
      row--;
      break;
    case "ArrowDown":
      row++;
      break;
    default:
      console.log("what the hell!!");
  }

  return {row, col};
};


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


const get_rooms_having_connection_cell = (rooms, connection_cell) => {
  var rooms_having_connection_cell = [];
  for (var i = 0; i < rooms.length; i++) {
    var room = rooms[i];
    if (does_any_connection_cell_of_room_match_given_connection_cell(room.connection_cells, connection_cell)) {
      rooms_having_connection_cell.push(room);
      if (rooms_having_connection_cell.length === 2) {
        return rooms_having_connection_cell;
      }
    }
  }
};

const does_any_connection_cell_of_room_match_given_connection_cell = (room_connection_cells, connection_cell) => {
  for (var i = 0; i < room_connection_cells.length; i++) {
    var room_connection_cell = room_connection_cells[i];
    if (room_connection_cell.row === connection_cell.row && room_connection_cell.col === connection_cell.col) {
      return true;
    }
  }
  return false;
};

const position_in_which_of_two_rooms = (position, room1, room2) => {
  if (is_position_in_room(position, room1)) {
    return room1;
  } else if (is_position_in_room(position, room2)) {
    return room2;
  } else {
    return null;
  }
};

const is_position_in_room = (position, room) => {
  return (position.row >= room.origin.row && position.row <= room.origin.row + room.height - 1)
    &&
    (position.col >= room.origin.col && position.col <= room.origin.col + room.width - 1);
};

const is_position_one_of_connection_cells = (position, connection_cells) => {
  for (var i = 0; i < connection_cells.length; i++) {
    var connection_cell = connection_cells[i];
    if (connection_cell.row === position.row && connection_cell.col === position.col) {
      return true;
    }
  }
  return false;
};


const health_handler = (gameState, healthIndex) => {
  var player = gameState.player;
  var healths = gameState.healths;
  var health = healths[healthIndex];

  player.position = health.position;
  player.health += health.amount;

  healths.splice(healthIndex, 1);

  return {
    player,
    healths
  };
};

const weapon_handler = (gameState, weaponIndex) => {
  var player = gameState.player;
  var weapons = gameState.weapons;
  var weapon = weapons[weaponIndex];

  player.position = weapon.position;
  player.weapon = weapon;

  delete player.weapon.position;
  weapons.splice(weaponIndex, 1);

  return {
    player,
    weapons
  }
};

const enemy_handler = (gameState, enemyIndex) => {
  var player = gameState.player;
  var enemies = gameState.enemies;
  var enemy = enemies[enemyIndex];

  var player_attack = get_player_attack(player);

  /* TODO :- Cleanup using :-
   this.setState({ selected: { ...this.state.selected, name: 'barfoo' } })
   See - http://stackoverflow.com/questions/18933985/this-setstate-isnt-merging-states-as-i-would-expect#comment50704283_18934259
   */

  var enemy_health = enemy.health;
  var player_health = player.health;

  enemy_health -= player_attack;
  player_health -= get_enemy_attack(enemy);

  if (player_health <= 0) {
    return {
      gameOver: true
    };
  }

  player.experience++;

  if (enemy_health <= 0) {
    enemies.splice(enemyIndex, 1);
    player.experience += 10;
  }

  player.level = get_player_level_based_on_exp(player);
  player.health = player_health;
  enemy.health = enemy_health;

  return {
    player,
    enemies
  };
};

const transporter_handler = (gameState) => {
  var currentDungeonLevel = gameState.dungeonLevel;
  return {
    dungeonLevel: currentDungeonLevel + 1
  };
};

const boss_handler = (gameState) => {
  var player = gameState.player;
  var boss = gameState.boss;

  /* TODO :- Cleanup using :-
   this.setState({ selected: { ...this.state.selected, name: 'barfoo' } })
   See - http://stackoverflow.com/questions/18933985/this-setstate-isnt-merging-states-as-i-would-expect#comment50704283_18934259
   */

  var boss_health = boss.health;
  var player_health = player.health;

  var player_attack = get_player_attack(player);

  boss_health -= player_attack;
  player_health -= get_boss_attack(boss);

  if (player_health <= 0) {
    return {
      gameOver: true
    };
  }

  if (boss.health <= 0) {
    return {
      playerWon: true,
      boss: null
    };
  }

  player.experience++;
  player.level = get_player_level_based_on_exp(player);
  player.health = player_health;
  boss.health = boss_health;

  return {
    player,
    boss
  }
};

const collision_handlers = {
  "health": health_handler,
  "enemy": enemy_handler,
  "weapon": weapon_handler,
  "transporter": transporter_handler,
  "boss": boss_handler
};

const take_action_based_on_collision_type = (collision_result, gameState) => {
  return collision_handlers[collision_result.characterType](gameState, collision_result.characterIndex);
};


const is_collision = (position, enemies, weapons, healths, transporter, boss) => {
  var health, enemy, weapon;

  if (health = collides_with_any_character(position, healths)) {
    return {
      characterType: "health",
      characterIndex: health.index
    };
  } else if (enemy = collides_with_any_character(position, enemies)) {
    return {
      characterType: "enemy",
      characterIndex: enemy.index
    };
  } else if (weapon = collides_with_any_character(position, weapons)) {
    return {
      characterType: "weapon",
      characterIndex: weapon.index
    };
  } else if (collides_with_any_character(position, transporter)) {
    return {
      characterType: "transporter",
    };
  } else if (collides_with_any_character(position, boss)) {
    return {
      characterType: "boss",
    };
  }

  return false;
};

const collides_with_any_character = (position, gameObject) => {

  if (gameObject == null) {
    return false;
  }

  if (Array.isArray(gameObject)) {
    for (var i = 0; i < gameObject.length; i++) {
      var character = gameObject[i];
      if (collides(position, character)) {
        return {
          index: i
        };
      }
    }
  } else {
    if (collides(position, gameObject)) {
      return true;
    }
  }
  return false;
};

const collides = (position, character) => (position.row === character.position.row && position.col === character.position.col);


const random = (lower_limit, upper_limit) => (   // upper limit is inclusive here
  ((Math.random() * (upper_limit - lower_limit + 1)) | 0) + lower_limit
);


const get_random_room = (dungeon) => {
  const rooms = dungeon.rooms;
  return rooms[random(0, rooms.length - 1)];
};


const get_random_position_in_room = (room) => {
  var random_col = random(room.origin.col, room.origin.col + room.width - 1);
  var random_row = random(room.origin.row, room.origin.row + room.height - 1);
  return {
    row: random_row,
    col: random_col
  }
};

const get_random_position_for_game_object = (dungeon) => (get_random_position_in_room(get_random_room(dungeon)));

const get_random_placement_for_game_object_with_room_handle = (dungeon) => {
  var room = get_random_room(dungeon);
  var position = get_random_position_in_room(room);
  return {
    room: room,
    position: position
  }
};

const is_position_taken = (position1, position2) => (position1.row === position2.row && position1.col === position2.col);

const object_position_already_taken = (object_position, other_objects) => {
  for (var i = 0; i < other_objects.length; i++) {
    if (is_position_taken(object_position, other_objects[i].position)) {
      return true;
    }
  }
  return false;
};


const convert_to_1d_index = (row, col, number_of_cols) => (row * number_of_cols + col);


class Screen {
  constructor(totalNumberOfRows, totalNumberOfCols) {
    this.totalNumberOfRows = totalNumberOfRows;
    this.totalNumberOfCols = totalNumberOfCols;
  }

  placeWeapons(weapons) {
    for (var i = 0; i < weapons.length; i++) {
      var weapon = weapons[i];
      if (this.doesSingleTileObjectLieOnScreen(weapon)) {
        this.projectSingleTileObjectOnScreen(weapon, "weapon");
      }
    }
  }

  placeBoss(boss) {
    if (this.doesSingleTileObjectLieOnScreen(boss)) {
      this.projectSingleTileObjectOnScreen(boss, "boss");
    }
  }

  placeTransporter(transporter) {
    if (this.doesSingleTileObjectLieOnScreen(transporter)) {
      this.projectSingleTileObjectOnScreen(transporter, "transporter");
    }
  }

  placeHealths(healths) {
    for (var i = 0; i < healths.length; i++) {
      var health = healths[i];
      if (this.doesSingleTileObjectLieOnScreen(health)) {
        this.projectSingleTileObjectOnScreen(health, "health");
      }
    }
  }

  placeEnemies(enemies) {
    for (var i = 0; i < enemies.length; i++) {
      var enemy = enemies[i];
      if (this.doesSingleTileObjectLieOnScreen(enemy)) {
        this.projectSingleTileObjectOnScreen(enemy, "enemy");
      }
    }
  }

  placePlayer(player) {
    if (this.doesSingleTileObjectLieOnScreen(player)) {
      this.projectSingleTileObjectOnScreen(player, "player");
    }
  }

  placeConnectionCells(connection_cells) {
    for (var i = 0; i < connection_cells.length; i++) {
      var connection_cell = connection_cells[i];
      if (this.doesSingleTileObjectLieOnScreen(connection_cell)) {
        this.projectSingleTileObjectOnScreen(connection_cell, "room");
      }
    }
  }

  doesSingleTileObjectLieOnScreen(object) {
    var row = object.row || object.position.row;
    return row >= this.startRow && row <= this.endRow;
  }

  doesRoomLieOnScreen(room) {
    return !(
      // won't lie condition
      this.endRow < room.origin.row || this.startRow > room.origin.row + room.height - 1
    );
  }

  placeRooms(rooms) {
    for (var i = 0; i < rooms.length; i++) {
      var room = rooms[i];
      if (this.doesRoomLieOnScreen(room)) {
        this.projectRoomOnScreen(room);
      }
    }
  }

  getVisibleNumberOfRows() {
    return Math.floor(this.totalNumberOfRows / 3);
  }

  getTotalNumberOfCols() {
    return this.totalNumberOfCols;
  }

  getTotalNumberOfRows() {
    return this.totalNumberOfRows;
  }
}


class LightScreen extends Screen {
  constructor(totalNumberOfRows, totalNumberOfCols) {
    super(totalNumberOfRows, totalNumberOfCols);
  }

  initBoardArray() {
    this.boardArray = Array(this.getVisibleNumberOfRows() * this.getTotalNumberOfCols());

    for (var i = 0; i < this.boardArray.length; i++) {
      this.boardArray[i] = <span key={i} className="tile wall"></span>;
    }
  }

  initPlayerPosition(player_position) {
    var rowsAbovePlayer = Math.floor((this.getVisibleNumberOfRows() - 1) / 2);
    var rowsBelowPlayer = this.getVisibleNumberOfRows() - (rowsAbovePlayer + 1);

    this.startRow = player_position.row - rowsAbovePlayer;
    this.endRow = player_position.row + rowsBelowPlayer;
  }

  initBoardWithPlayerPosition(player_position) {
    this.initBoardArray();
    this.initPlayerPosition(player_position);
  }

  projectRoomOnScreen(room) {
    var roomProjectionOnScreenStartRow = Math.max(room.origin.row, this.startRow);
    var roomProjectionOnScreenEndRow = Math.min(room.origin.row + room.height - 1, this.endRow);

    for (var row = roomProjectionOnScreenStartRow; row <= roomProjectionOnScreenEndRow; row++) {
      for (var col = room.origin.col; col < room.origin.col + room.width; col++) {
        var index = convert_to_1d_index(row - this.startRow, col, this.totalNumberOfCols);
        this.boardArray[index] = <span key={index} className="tile room"></span>;
      }
    }
  }

  projectSingleTileObjectOnScreen(object, tileClass) {
    var row = object.row || object.position.row;
    var col = object.col || object.position.col;
    var index = convert_to_1d_index(row - this.startRow, col, this.totalNumberOfCols);
    this.boardArray[index] = <span key={index} className={`tile ${tileClass}`}></span>;
  }

  getRenderableBoard() {
    return this.boardArray;
  }
}


class DarkScreen extends Screen {
  constructor(totalNumberOfRows, totalNumberOfCols) {
    super(totalNumberOfRows, totalNumberOfCols);
    this.octagonSize = 7;
  }

  initBoardArray() {
    this.boardArray = Array(this.getVisibleNumberOfRows() * this.getTotalNumberOfCols());

    for (var row = this.startRow; row <= this.endRow; row++) {
      for (var col = 0; col < this.totalNumberOfCols; col++) {
        var index = convert_to_1d_index(row - this.startRow, col, this.totalNumberOfCols);
        if (distance([row, col], [this.playerPosition.row, this.playerPosition.col]) <= this.octagonSize) {
          this.boardArray[index] = <span key={index} className="tile wall"></span>;
        } else {
          this.boardArray[index] = <span key={index} className="tile dark"></span>;
        }
      }
    }
  }

  initPlayerPosition(player_position) {
    var rowsAbovePlayer = Math.floor((this.getVisibleNumberOfRows() - 1) / 2);
    var rowsBelowPlayer = this.getVisibleNumberOfRows() - (rowsAbovePlayer + 1);

    this.startRow = player_position.row - rowsAbovePlayer;
    this.endRow = player_position.row + rowsBelowPlayer;
    this.playerPosition = player_position;
  }

  initBoardWithPlayerPosition(player_position) {
    this.initPlayerPosition(player_position);
    this.initBoardArray();
  }

  projectRoomOnScreen(room) {
    var roomProjectionOnScreenStartRow = Math.max(room.origin.row, this.startRow);
    var roomProjectionOnScreenEndRow = Math.min(room.origin.row + room.height - 1, this.endRow);

    for (var row = roomProjectionOnScreenStartRow; row <= roomProjectionOnScreenEndRow; row++) {
      for (var col = room.origin.col; col < room.origin.col + room.width; col++) {
        var index = convert_to_1d_index(row - this.startRow, col, this.totalNumberOfCols);
        if (distance([row, col], [this.playerPosition.row, this.playerPosition.col]) <= this.octagonSize) {
          this.boardArray[index] = <span key={index} className="tile room"></span>;
        }
      }
    }
  }

  projectSingleTileObjectOnScreen(object, tileClass) {
    var row = object.row || object.position.row;
    var col = object.col || object.position.col;
    var index = convert_to_1d_index(row - this.startRow, col, this.totalNumberOfCols);
    if (distance([row, col], [this.playerPosition.row, this.playerPosition.col]) <= this.octagonSize) {
      this.boardArray[index] = <span key={index} className={`tile ${tileClass}`}></span>;
    }
  }

  getRenderableBoard() {
    return this.boardArray;
  }

}

const distance = ([row1, col1], [row2, col2]) => (
  Math.sqrt(Math.pow(row1 - row2, 2) + Math.pow(col1 - col2, 2))
);


const get_starting_weapon = () => ({
  name: "Bare Hands",
  attack: 40
});

const get_weapons = (dungeon, dungeon_level, already_present_game_objects) => {
  var weapons = [];
  for (var i = 0; i < 3; i++) {
    while (true) {
      var weapon_position = get_random_position_for_game_object(dungeon);
      if (!object_position_already_taken(weapon_position, already_present_game_objects)) {
        weapons.push(make_weapon_with_position_according_to_level_and_index(weapon_position, dungeon_level, i));
        break;
      }
    }
  }
  return weapons;
};

const make_weapon_with_position_according_to_level_and_index = (weapon_position, dungeon_level, weaponIndex) => ({
  position: weapon_position,
  name: weapons[dungeon_level - 1][weaponIndex].name,
  attack: weapons[dungeon_level - 1][weaponIndex].attack,
});

const weapons = [
  [{
    name: "Claws and Teeth",
    attack: 50
  }, {
    name: "Poisonous Fangs",
    attack: 100
  }, {
    name: "Cursed Dagger",
    attack: 150
  }], [{
    name: "Bludgeon Hammer",
    attack: 200
  }, {
    name: "Demonic Cleavers",
    attack: 250
  }, {
    name: "Enchanted Chainsaw",
    attack: 300
  }], [{
    name: "Sword of Dark Knight",
    attack: 450
  }, {
    name: "Sword of Angel Blood",
    attack: 600
  }, {
    name: "Demon Spirit Sword",
    attack: 800
  }], [{
    name: "Lightening of Death",
    attack: 1100
  }, {
    name: "Inner Darkness",
    attack: 1400
  }, {
    name: "Summoner Staff",
    attack: 2000
  }]
];


const get_transporter = (dungeon, already_present_game_objects) => {
  while (true) {
    var transporter_position = get_random_position_for_game_object(dungeon);
    if (!object_position_already_taken(transporter_position, already_present_game_objects)) {
      return {
        position: transporter_position
      }
    }
  }
};


const get_player = (dungeon, dungeon_level, player) => {
  var result = get_random_placement_for_game_object_with_room_handle(dungeon);

  if (dungeon_level > 1) {
    player.position = result.position;
    player.room = result.room;
    player.connection_cell = null;
    return player;
  } else {
    return {
      position: result.position,
      room: result.room,
      connection_cell: null,
      health: 100,
      experience: 0,
      level: 1,
      weapon: get_starting_weapon()
    }
  }
};

const get_player_level_based_on_exp = (player) => {
  if (player.experience < 40) {
    return 1;
  } else if (player.experience < 100) {
    return 2;
  } else if (player.experience < 200) {
    return 3;
  } else if (player.experience < 300) {
    return 4;
  } else if (player.experience < 350) {
    return 5;
  } else {
    return 6;
  }
};

const get_standard_player_attack = (player) => {
  var player_attack = Math.floor((player.level / 3) * player.weapon.attack);
  return player_attack;
};

const get_player_attack = (player) => {
  var player_attack = Math.floor((player.level / 3) * player.weapon.attack);
  var upper = Math.floor(0.9 * player_attack);
  var lower = Math.floor(1.0 * player_attack);
  return random(upper, lower);
};


const get_healths = (dungeon, dungeon_level, already_present_game_objects, number_of_healths) => {
  var healths = [];
  for (var i = 0; i < number_of_healths; i++) {
    while (true) {
      var health_position = get_random_position_for_game_object(dungeon);
      if (!object_position_already_taken(health_position, already_present_game_objects)) {
        healths.push(make_health_according_to_dungeon_level(health_position, dungeon_level));
        break;
      }
    }
  }
  return healths;
};

const make_health_according_to_dungeon_level = (health_position, dungeon_level) => ({
  position: health_position,
  amount: 200
});

const get_enemy_attack = (enemy) => {
  var enemy_attack = enemy.attack;
  var upper = Math.floor(0.9 * enemy_attack);
  var lower = Math.floor(1.0 * enemy_attack);
  return random(upper, lower);
};


const get_enemies = (dungeon, dungeon_level, already_present_game_objects, number_of_enemies) => {
  var enemies = [];
  for (var i = 0; i < number_of_enemies; i++) {
    while (true) {
      var enemy_position = get_random_position_for_game_object(dungeon);
      if (!object_position_already_taken(enemy_position, already_present_game_objects)) {
        enemies.push(make_enemy_with_position_according_to_level(enemy_position, dungeon_level));
        break;
      }
    }
  }
  return enemies;
};

const make_enemy_with_position_according_to_level = (enemy_position, dungeon_level) => ({
  position: enemy_position,
  level: dungeon_level,
  health: get_health_from_dungeon_level(dungeon_level),
  attack: get_attack_from_dungeon_level(dungeon_level)
});

const get_health_from_dungeon_level = (dungeon_level) => (
  enemy_level_to_health_attack_map[dungeon_level - 1].health
);

const get_attack_from_dungeon_level = (dungeon_level) => (
  enemy_level_to_health_attack_map[dungeon_level - 1].attack
);

const enemy_level_to_health_attack_map = [{
  health: 60,
  attack: 20
}, {
  health: 600,
  attack: 50
}, {
  health: 1000,
  attack: 80
}, {
  health: 2400,
  attack: 125
}];


const select_a_random_room_index = (list_of_rooms) => (random(0, list_of_rooms.length - 1));

const get_random_rooms = (number_of_rooms, max_width, min_width, max_height, min_height) => {
  var rooms = [];
  for (var i = 0; i < number_of_rooms; i++) {
    rooms.push({
      id: i,
      width: random(max_width, min_width),
      height: random(max_height, min_height)
    });
  }
  return rooms;
};

const position_room_randomly_on_board = (total_number_of_rows, total_number_of_columns, a_room) => {
  var row, col;

  for (var i = 0; i < 10; i++) {   // max 10 trials
    var r_row = random(0, total_number_of_rows - 1);
    var r_col = random(0, total_number_of_columns - 1);
    if (r_row + a_room.height <= total_number_of_rows && r_col + a_room.width <= total_number_of_columns) {
      row = r_row;
      col = r_col;
      break;
    }
  }

  if (row === undefined || col === undefined) {
    throw new Error("Could not place first room on the board", JSON.stringify({
      total_number_of_rows: total_number_of_rows,
      total_number_of_columns: total_number_of_columns,
      a_room: a_room
    }));
  }

  return {row, col};
};


const is_unplaced_room_outside_the_board = (unplaced_room_tentative_origin, unplaced_room,
                                            total_number_of_rows, total_number_of_columns) => {
  var tentative_full_unplaced_room_object = {
    origin: unplaced_room_tentative_origin,
    height: unplaced_room.height,
    width: unplaced_room.width
  };

  return tentative_full_unplaced_room_object.origin.row < 0
    ||

    tentative_full_unplaced_room_object.origin.col < 0
    ||

    tentative_full_unplaced_room_object.origin.row + tentative_full_unplaced_room_object.height >= total_number_of_rows
    ||

    tentative_full_unplaced_room_object.origin.col + tentative_full_unplaced_room_object.width >= total_number_of_columns;
};

const does_unplaced_room_overlap_with_other_rooms = (unplaced_room_tentative_origin, unplaced_room, all_placed_rooms) => {

  var tentative_full_unplaced_room_object = {
    origin: unplaced_room_tentative_origin,
    height: unplaced_room.height,
    width: unplaced_room.width
  };

  for (var i = 0; i < all_placed_rooms.length; i++) {

    var result = do_rooms_overlap_or_touch(all_placed_rooms[i], tentative_full_unplaced_room_object);

    if (result) {
      return true;
    }
  }

  return false;
};

const get_placed_room_connection_side = (total_number_of_rows, total_number_of_columns, placed_room) => {
  for (var i = 0; i < 10; i++) {
    var placed_room_connection_side = ["top", "left", "bottom", "right"][random(0, 3)];
    if (placed_room_connection_side === "top") {
      if (placed_room.origin.row > 1) {
        return placed_room_connection_side;
      }
    } else if (placed_room_connection_side === "left") {
      if (placed_room.origin.col > 1) {
        return placed_room_connection_side;
      }
    } else if (placed_room_connection_side === "bottom") {
      if (placed_room.origin.row + placed_room.height - 1 < total_number_of_rows - 2) {
        return placed_room_connection_side;
      }
    } else if (placed_room_connection_side === "right") {
      if (placed_room.origin.col + placed_room.width - 1 < total_number_of_columns - 2) {
        return placed_room_connection_side;
      }
    }
  }

  throw new Error("Could not select side");
};


const try_to_create_connection_at_a_random_place_between_rooms = (total_number_of_rows, total_number_of_columns,
                                                                  placed_room, unplaced_room) => {
  /* select side of connection */
  var placed_room_connection_side =
    get_placed_room_connection_side(total_number_of_rows, total_number_of_columns, placed_room);

  if (placed_room_connection_side === "top") {
    var connection_cell_row = placed_room.origin.row - 1;
    var connection_cell_column = random(placed_room.origin.col, placed_room.origin.col + placed_room.width - 1);
  } else if (placed_room_connection_side === "bottom") {
    var connection_cell_row = placed_room.origin.row + placed_room.height;
    var connection_cell_column = random(placed_room.origin.col, placed_room.origin.col + placed_room.width - 1);
  } else if (placed_room_connection_side === "left") {
    var connection_cell_column = placed_room.origin.col - 1;
    var connection_cell_row = random(placed_room.origin.row, placed_room.origin.row + placed_room.height - 1);
  } else if (placed_room_connection_side === "right") {
    var connection_cell_column = placed_room.origin.col + placed_room.width;
    var connection_cell_row = random(placed_room.origin.row, placed_room.origin.row + placed_room.height - 1);
  }

  if (placed_room_connection_side === "top" || placed_room_connection_side === "bottom") {
    var unplaced_room_connection_position = random(0, unplaced_room.width - 1);
  } else if (placed_room_connection_side === "left" || placed_room_connection_side === "right") {
    var unplaced_room_connection_position = random(0, unplaced_room.height - 1);
  }

  var connection_cell = {
    row: connection_cell_row,
    col: connection_cell_column
  };

  var unplaced_room_origin =
    get_unplaced_room_origin(placed_room_connection_side, connection_cell, unplaced_room_connection_position, unplaced_room);

  return {
    connection_cell: connection_cell,
    unplaced_room_origin: unplaced_room_origin
  }
};

const get_unplaced_room_origin = (placed_room_connection_side, connection_cell, unplaced_room_connection_position, unplaced_room) => {
  if (placed_room_connection_side === "top") {   // connection is on top of placed room
    var unplaced_room_row = connection_cell.row - unplaced_room.height;
    var unplaced_room_column = connection_cell.col - unplaced_room_connection_position;
  } else if (placed_room_connection_side === "bottom") {
    var unplaced_room_row = connection_cell.row + 1;
    var unplaced_room_column = connection_cell.col - unplaced_room_connection_position;
  } else if (placed_room_connection_side === "left") {
    var unplaced_room_column = connection_cell.col - unplaced_room.width;
    var unplaced_room_row = connection_cell.row - unplaced_room_connection_position;
  } else if (placed_room_connection_side === "right") {
    var unplaced_room_column = connection_cell.col + 1;
    var unplaced_room_row = connection_cell.row - unplaced_room_connection_position;
  }

  return {
    row: unplaced_room_row,
    col: unplaced_room_column
  };
};


const add_to_connection_cells = (connection_cells, connection_cell) => {
  if (!connection_cells) {
    connection_cells = [];
  }

  connection_cells.push(connection_cell);
  return connection_cells;
};

const get_dungeon = ({
  total_number_of_rows, total_number_of_columns, number_of_rooms, max_width, min_width,
  max_height, min_height
}) => {
  var rooms = get_random_rooms(number_of_rooms, max_width, min_width, max_height, min_height);
  var unplaced_rooms = rooms;
  var placed_rooms = [];
  var connection_cells_between_rooms = [];

  var a_room_index = select_a_random_room_index(unplaced_rooms);
  var room_position = position_room_randomly_on_board(total_number_of_rows,
    total_number_of_columns,
    unplaced_rooms[a_room_index]);

  unplaced_rooms[a_room_index].origin = room_position;

  placed_rooms.push(unplaced_rooms[a_room_index]);
  unplaced_rooms.splice(a_room_index, 1);

  var runner = 0;
  while (unplaced_rooms.length != 0) {
    var placed_room_index = select_a_random_room_index(placed_rooms);
    var unplaced_room_index = select_a_random_room_index(unplaced_rooms);

    for (var i = 0; i < 50; i++) {

      var outcome = try_to_create_connection_at_a_random_place_between_rooms(total_number_of_rows,
        total_number_of_columns,
        placed_rooms[placed_room_index],
        unplaced_rooms[unplaced_room_index]);

      if (!is_unplaced_room_outside_the_board(outcome.unplaced_room_origin, unplaced_rooms[unplaced_room_index],
          total_number_of_rows, total_number_of_columns) && !does_unplaced_room_overlap_with_other_rooms(outcome.unplaced_room_origin, unplaced_rooms[unplaced_room_index], placed_rooms)) {

        unplaced_rooms[unplaced_room_index].origin = outcome.unplaced_room_origin;

        unplaced_rooms[unplaced_room_index].connection_cells =
          add_to_connection_cells(unplaced_rooms[unplaced_room_index].connection_cells, outcome.connection_cell);

        placed_rooms[placed_room_index].connection_cells =
          add_to_connection_cells(placed_rooms[placed_room_index].connection_cells, outcome.connection_cell);

        placed_rooms.push(unplaced_rooms[unplaced_room_index]);
        unplaced_rooms.splice(unplaced_room_index, 1);
        connection_cells_between_rooms.push(outcome.connection_cell);
        break;
      }
    }
  }

  return {
    rooms: placed_rooms,
    connection_cells: connection_cells_between_rooms
  };

};


const get_boss = (dungeon, already_present_game_objects) => {
  while (true) {
    var boss_position = get_random_position_for_game_object(dungeon);
    if (!object_position_already_taken(boss_position, already_present_game_objects)) {
      return {
        position: boss_position,
        health: 5000,
        attack: 350
      }
    }
  }
};

const get_boss_attack = (boss) => {
  var boss_attack = boss.attack;
  var upper = Math.floor(0.9 * boss_attack);
  var lower = Math.floor(1.0 * boss_attack);
  return random(upper, lower);
};


const GameScreen = ({screen, dungeon, player, enemies, weapons, healths, boss, transporter}) => {

  screen.initBoardWithPlayerPosition(player.position);

  screen.placeRooms(dungeon.rooms);

  screen.placeConnectionCells(dungeon.connection_cells);

  screen.placePlayer(player);

  screen.placeEnemies(enemies);

  screen.placeWeapons(weapons);

  screen.placeHealths(healths);


  if (boss) {
    screen.placeBoss(boss);
  }

  if (transporter) {
    screen.placeTransporter(transporter);
  }

  return <div className="game-screen">{screen.getRenderableBoard()}</div>;

};

const GameMenu = ({dungeonLevel, player, toggleScreen}) => (
  <div className="menu">
    <div className="game-info">
      <ul>
        <li className="health-menu">
          <span className="label">Health: </span>
          <span>{player.health}</span>
        </li>

        <li className="weapon-menu">
          <span className="label">Weapon: </span>
          <span>{player.weapon.name}</span>
        </li>

        <li className="exp-menu">
          <span className="label">Exp: </span>
          <span>{player.experience}</span>
        </li>

        <li className="attack-menu">
          <span className="label">Attack: </span>
          <span>{get_standard_player_attack(player)}</span>
        </li>

        <li className="level-menu">
          <span className="label">Level: </span>
          <span>{player.level}</span>
        </li>

        <li className="dg-level-menu">
          <span className="label">Dungeon Level: </span>
          <span>{dungeonLevel}</span>
        </li>
      </ul>
    </div>

    <div className="button-panel">
      <button onClick={toggleScreen} className="toggle-button" id="toggler">Toggle Darkness</button>
    </div>
  </div>
);


//const humane = require('humane-js');
//const _ = require('lodash');

const notifier = humane.create({baseCls: 'humane-jackedup', timeout: 4000});
notifier.error = notifier.spawn({addnCls: 'humane-jackedup-error'});
notifier.success = notifier.spawn({addnCls: 'humane-jackedup-success'});


class Board extends React.Component {

  constructor(props) {
    super(props);

    /*
     All possible attributes are shown below for documentation purposes.
     The state object will be initialized later.
     */

    this.handleKeyPress = _.throttle(this.handleKeyPress.bind(this), 100);
    this.resetGame = this.resetGame.bind(this);
    this.toggleScreen = this.toggleScreen.bind(this);

    this.state = {
      dungeon: null,
      dungeonLevel: 1,
      player: null,
      enemies: null,
      boss: null,
      weapons: null,
      healths: null,
      transporter: null,
      gameOver: false,
      playerWon: false,
      screen: new DarkScreen(props.game_args.total_number_of_rows, props.game_args.total_number_of_columns),
      screenType: "Dark"
    };
  }


  readyGame(dungeonLevel) {
    var number_of_enemies = 10;
    var number_of_healths = 6;
    var gameObjects = [];

    var game_args = this.props.game_args;

    const dungeon = get_dungeon(game_args);

    const player = get_player(dungeon, dungeonLevel, this.state.player);
    gameObjects.push(player);

    const enemies = get_enemies(dungeon, dungeonLevel, gameObjects, number_of_enemies);
    Array.prototype.push.apply(gameObjects, enemies);

    var boss, transporter = null;
    if (dungeonLevel === 4) { //  Last level
      boss = get_boss(dungeon, gameObjects);
      gameObjects.push(boss);
    } else {
      transporter = get_transporter(dungeon, gameObjects);
      gameObjects.push(transporter);
    }

    const weapons = get_weapons(dungeon, dungeonLevel, gameObjects);
    Array.prototype.push.apply(gameObjects, weapons);

    const healths = get_healths(dungeon, dungeonLevel, gameObjects, number_of_healths);
    Array.prototype.push.apply(gameObjects, healths);

    return {
      dungeon,
      dungeonLevel,
      player,
      enemies,
      boss,
      weapons,
      healths,
      transporter
    }
  }

  toggleScreen() {
    if (this.state.screenType === "Light") {
      this.setState({
        screenType: "Dark",
        screen: new DarkScreen(this.props.game_args.total_number_of_rows,
          this.props.game_args.total_number_of_columns)
      });
    } else if (this.state.screenType === "Dark") {
      this.setState({
        screenType: "Light",
        screen: new LightScreen(this.props.game_args.total_number_of_rows,
          this.props.game_args.total_number_of_columns)
      });
    }
  }

  resetGame() {
    var resetGameStatus = this.readyGame(1);
    resetGameStatus.gameOver = false;
    resetGameStatus.playerWon = false;
    this.setState(resetGameStatus);
  }

  componentWillMount() {
    const gameState = this.readyGame(1);
    this.setState(gameState);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  isLastLevel() {
    return this.state.dungeonLevel === 4;
  }

  isKeyPressEventConsumable(e) {
    return !this.state.gameOver && !this.state.playerWon && (
        e.key === "ArrowRight" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      );
  };

  handleKeyPress(e) {
    if (this.isKeyPressEventConsumable(e)) {
      var newGameState = move(e.key, this.state);

      if (newGameState.gameOver) {
        notifier.error('You are dead, Bruh!');
        this.setState({gameOver: true});
        setTimeout(() => this.resetGame(), 1000);
      } else if (newGameState.playerWon) {
        notifier.success("You are victorious, Bruh!");
        this.setState({playerWon: true});
      } else if (newGameState.dungeonLevel === this.state.dungeonLevel + 1) {
        this.setState(this.readyGame(newGameState.dungeonLevel));
      } else {
        this.setState(newGameState);
      }
      e.preventDefault();
    }
  }

  render() {
    return (
      <BoardSlave
        {...this.state}
        toggleScreen={this.toggleScreen}
      />
    );
  }
}

const BoardSlave = (props) => (
  <div className="game-holder">
    <GameMenu
      toggleScreen={props.toggleScreen}
      dungeonLevel={props.dungeonLevel}
      player={props.player}
    />

    <GameScreen {...props}/>
  </div>
);


const App = (props) => {
  return (
    <div id="app">
      <h1>React Roguelike</h1>
      <h4>Kill the boss in dungeon 4</h4>
      <Board game_args={props.game_args}/>
    </div>
  );
};


App.defaultProps = {
  game_args: {
    total_number_of_rows: 102,
    total_number_of_columns: 100,
    number_of_rooms: 20,
    max_width: 20,
    min_width: 4,
    max_height: 20,
    min_height: 4
  }
};


ReactDOM.render(<App />, document.querySelector('.container'));
