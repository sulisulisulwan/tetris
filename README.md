
Next up:

Animation scripts
Game Statistics


Extended lockdown

Tetrimino touches surface.  0.5 seconds lockdown timer starts
  Player moves/rotates maximum 15 times then lockdown
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
