NextQueue works when we update state with the class itself


Currently working on fleshing out each game phase pseudocode logic

Skipping Pregame for now
Should be able to work on Generating and Falling




PlayerControl.keystrokeHandler
  blah   

PlayerControl.{action}
  Handles strokeType ('keyup', 'keydown') logic
  Calls tetrimino movement handler
    EXPECTS RETURN
    {
      newTetrimino,
      newPlayField
    }
  Calls setState
  Returns void

TetriminoMovementHandler.{action}
  Accepts playField and tetrimino copies
  Updates those copies
  Returns those copies as an object:
  {
    newTetrimino,
    newPlayField
  }



