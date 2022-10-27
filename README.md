
Next up:


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
  
Revising flip points based on specifications for each tetrimino (Some flippoints shouldn't exist)
T-spin recognition per fall round
Animation scripts
Game Statistics
Hold feature


Multiplayer 
Game Over state: Multiplayer
