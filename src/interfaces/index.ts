import * as React from "react"
import { HoldQueue } from "../core/hold-queue/HoldQueue" 
import { LevelGoals } from "../core/level-goals/LevelGoals"
import { NextQueue } from "../core/next-queue/NextQueue"
import { TetriminoMovementHandler } from "../core/tetrimino/movement-handler/TetriminoMovementHandler" 
import { 
  Off,
  Pregame,
  Generation,
  FallingClassic,
  FallingExtended,
  FallingInfinite,
  LockClassic,
  LockExtended,
  LockInfinite,
  Pattern,
  Animate,
  Eliminate,
  Completion,
  Iterate,
  GameOver
} from "../core/engine-phases"
import { BaseAward } from "../core/scoring/awards/BaseAward"
import { BaseScoringHandler } from "../core/scoring/modes/BaseScoringHandler"

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
export type setAppStateIF = React.Dispatch<React.SetStateAction<appStateIF>>

export interface autoRepeatIF {
  left: boolean
  right: boolean
  override: null | string
}

export interface playerActionIF {
  autoRepeat: autoRepeatIF,
  softdrop: boolean
  harddrop: boolean
  flipClockwise: boolean
  flipCounterClockwise: boolean
  hold: boolean
}

export declare interface appStateIF {
  gameOptions: gameOptionsIF
  view: string
  currentTetrimino: null | tetriminoIF
  playfield: string[][]
  gameMode: string
  nextQueue: null | string[]
  holdQueue: holdQueueIF
  currentGamePhase: string
  playerAction: playerActionIF,
  rightIntervalId: null | NodeJS.Timeout
  leftIntervalId: null | NodeJS.Timeout
  autoRepeatDelayTimeoutId: null | NodeJS.Timeout
  fallIntervalId: null | NodeJS.Timeout
  pregameIntervalId: null | NodeJS.Timeout
  lockTimeoutId: null | NodeJS.Timeout
  pregameCounter: number
  extendedLockdownMovesRemaining: number
  lowestLockSurfaceRow: null | number
  postLockMode: boolean
  eliminationActions: eliminationActionsIF[]
  currentLevel: number
  scoringItemsForCompletion: scoreItemIF[]
  levelClearedLinesGoal: number
  fallSpeed: number
  totalLinesCleared: number
  totalScore: number
  performedTSpin: boolean
  performedTSpinMini: boolean
  backToBack: boolean
  scoringHistoryPerCycle: scoringHistoryPerCycleIF
  ghostTetriminoOn: boolean
  ghostCoords: coordinates[]
}

export interface scoringHistoryPerCycleIF {
  softdrop?: scoringDataIF[]
  lineClear?: boolean
}

export type scoringDataIF = { 
  currentScore?: number 
  linesDropped?: number
  currentLevel?: number
  linesCleared?: number, 
  performedTSpin?: boolean,
  performedTSpinMini?: boolean,
  backToBack?: boolean
}

export interface scoreItemIF {
  scoringMethodName: string
  scoringData: scoringDataIF
}

export interface eliminationActionsIF {
  eliminatorName: string
  actionData: any // TODO: this needs to be updated
}

export type eliminator = (playfield: string[][], actionData: any /* TODO: make this stronger*/) => string[][]

export interface eliminatorsIF {
  lineClear: eliminator
}



export interface eventDataIF {
  key: string,
  strokeType: string
  action: string
}

export interface playerActionHandlersIF {
  left: Function
  right: Function
  flipClockwise: Function
  flipCounterClockwise: Function
  softdrop: Function
  harddrop: Function
  hold: Function
  pauseGame: Function
}


export interface possibleActivePatternsIF {
  lineClear: boolean
}

export interface tetriminoGraphicsIF {
  OTetriminoGraphic: string[][]  
  ITetriminoGraphic: string[][]  
  TTetriminoGraphic: string[][]  
  JTetriminoGraphic: string[][]  
  LTetriminoGraphic: string[][]  
  STetriminoGraphic: string[][]  
  ZTetriminoGraphic: string[][]  
  emptyGraphic: string[][]  
}

export interface holdQueueIF {
  swapStatus: string
  heldTetrimino: null | tetriminoIF
}

export interface levelColorsIF {
  [key: number]: string
}

export interface sharedHandlersIF {
  tetriminoMovementHandler: TetriminoMovementHandler
  scoringHandler: BaseScoringHandler
  levelGoalsHandler: LevelGoals
  nextQueueHandler: NextQueue
  holdQueueHandler: HoldQueue
  setAppState: setAppStateIF
}

export interface initialOptionsIF {
  possibleActivePatterns: {
    lineClear: boolean
  }
  rotationSystem: string
  scoringSystem: string
  levelGoalsSystem: string
  lockMode: string
  setAppState: null | setAppStateIF
}
export interface gameOptionsIF {
  possibleActivePatterns: {
    lineClear: boolean
  }
  rotationSystem: string
  scoringSystem: string
  levelGoalsSystem: string
  lockMode: string
  setAppState: null | setAppStateIF
}
export interface GenericObjectInterface {
  [key: string]: any
}

export interface tSlotCornersGetters {
  getTSlotCorners_north: Function
  getTSlotCorners_south: Function
  getTSlotCorners_east: Function
  getTSlotCorners_west: Function
}

export interface isATSlotCorner {
  a: boolean
  b: boolean
  c: boolean
  d: boolean
}

export interface relativeOrientations {
  north: flipDirections
  south: flipDirections
  east: flipDirections
  west: flipDirections
}

export interface flipDirections {
  flipCounterClockwise: string
  flipClockwise: string
}

export interface tetriminoIF {
  startingGridPosition: coordinates
  currentOriginOnPlayfield: coordinates
  localGridSize: number
  currentOrientation: string
  status: string
  orientations?: orientationsIF
  name?: string
  minoGraphic?: string
  ghostCoordsOnPlayfield: number[]
}

export interface orientationsIF {
  north: orientationDataIF,
  east: orientationDataIF,
  south: orientationDataIF,
  west: orientationDataIF
}

export interface orientationDataIF {
  coordsOffOrigin: coordinates[]
  rotationPoints: rotationPointsIF
  lowestRowOffOrigin: number
}

export type coordinates = [number, number]

export interface rotationPointsIF {
  '1': coordinates
  '2': coordinates
  '3': coordinates
  '4': coordinates
  '5': coordinates
}

export interface directionsIF {
  right: Function
  left: Function
  down: Function
  inPlace: Function
}

export interface scoringMethodsIF {
  [key: string]: Function
}

export interface patternScannersIF {
  lineClear: Function
}

export interface actionItemIF {
  eliminatorName: string
  actionData: any 
}