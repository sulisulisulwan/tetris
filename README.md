
Next up:

Animation scripts
Game Statistics


Options: next queue, hold queue, ghost piece, lock down, background music, sound effects

Variable Goal system


TODO: Infinite lockdown bug:
  if rotating Tetrimino like crazy to prevent lockdown and then allowing block to rest on surface, lockdown isn't triggered

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



NEEDS TESTING:

Classic lockdown (lock and falling)
Infinite lockdown (lock and falling)
Extended lockdown (lock and falling)








Completion
Pattern
leftAndRight
LevelGoals
Classic Scoring