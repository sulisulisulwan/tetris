class PlayerControl {
  // This class should interface with TetriminoMovementHandler
  // It doesn't know the complexities of the MovementHandler
  // It only knows the physical motions of the player, and 
  // decides to call the MovementHandler according how the game behavior
  // should match the physical rhythm of the player.  Ex. if a player
  // holds down a key, should it give repeated commands in rapid fire
  // to the MovementHandler?  If so, should the reptition happen immediately
  // or on delay by half a second?  Things of this nature.

  // TetriminoMovementHandler concerns itself mainly with validation
  // and updating the tetrimino's state 

  // This class may end up existing on the React side of things.
}