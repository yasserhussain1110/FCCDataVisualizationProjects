import {get_random_position_for_game_object, object_position_already_taken} from '../algo/common';

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

export default get_healths;
