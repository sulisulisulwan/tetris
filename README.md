
Next up:

Animation scripts
Game Statistics


Options: next queue, hold queue, ghost piece, lock down, background music, sound effects


TODO: Extended placement lockdown bug:
  if rotating Tetrimino up until post 15 move lockdown and continuing the flipping motion, the new generated tetrimino will disappear and be replaced by another

X Refactor HoldQueue and NextQueue to act as static classes
  - Keep NextQueue linked list in state
    - Arrayification of linked list will be done in the NextQueueDisplay component
    - Ergo, NextQueue public methods should take in old state and send back newState 
  - holdQueue is already in state.  
    - HoldQueue can deal with sending back newState

Refactor pattern marking.
  May require each square to have its own metadata: {
    minoGraphic: "[o]"
    eliminate: {
      isMarked: boolean
      reason: "ex. lineClear"
    }
  }
  

Multiplayer 
Game Over state: Multiplayer
