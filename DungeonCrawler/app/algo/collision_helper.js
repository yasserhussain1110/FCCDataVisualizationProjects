import {get_player_attack, get_player_level_based_on_exp} from '../gameobjects/player';

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
  player_health -= enemy.attack;

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
  player_health -= boss.attack;

  if (player.health <= 0) {
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

export const take_action_based_on_collision_type = (collision_result, gameState) => {
  return collision_handlers[collision_result.characterType](gameState, collision_result.characterIndex);
};


export const is_collision = (position, enemies, weapons, healths, transporter, boss) => {
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
