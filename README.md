
Next up:

Animation scripts
Game Statistics


Options: next queue, hold queue, ghost piece, lock down, background music, sound effects


Extended placement lockdown
classic lockdown

Tetrimino touches surface.  0.5 seconds lockdown timer starts
  Player gets 15 move/rotate counter 
    - same aportioned counter used when on or above the lowest surface where the counter was first aportioned
      - Each move within the counter will reset lockdown timer.
      - Once all 15 used up, 
        - Tetrimino touching no surface below can still be moved around
        - Tetrimino touching surface locks down immediately
    - Counter resets to 15 if the Tetrimino falls below the surface.
      


    UNLESS: 


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
