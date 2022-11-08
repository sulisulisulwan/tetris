import Off from '../phases/Off'
import Pregame from '../phases/Pregame'
import Generation from '../phases/Generation'
import FallingClassic from '../phases/FallingClassic'
import FallingExtended from '../phases/FallingExtended'
import FallingInfinite from '../phases/FallingInfinite'
import LockClassic from '../phases/Pregame'
import  LockExtended from '../phases/LockExtended'
import  LockInfinite from '../phases/LockInfinite'
import  Pattern from '../phases/Pattern'
import  Animate from '../phases/Animate'
import  Eliminate from '../phases/Eliminate'
import  Completion from '../phases/Completion'
import  Iterate from '../phases/Iterate'
import  GameOver from '../phases/GameOver'

export interface phases {
  off: Off
  pregame: Pregame
  generation: Generation
  falling: FallingClassic | FallingExtended | FallingInfinite
  lock: LockClassic | LockExtended | LockInfinite
  pattern: Pattern
  animate: Animate
  eliminate: Eliminate
  completion: Completion
  iterate: Iterate
  gameOver: GameOver
}