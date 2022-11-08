import * as React from "react"
import { tetriminoIF } from "../core/tetriminos/interfaces"
import { eliminationActionsIF } from "../core/engine-phases/phases/interfaces/EliminateIFs"

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
  scoringItemsForCompletion: scoringItemsForCompletionIF[]
  levelClearedLinesGoal: number
  fallSpeed: number
  totalLinesCleared: number
  totalScore: number
  performedTSpin: boolean
  performedTSpinMini: boolean
  backToBack: boolean
  scoringHistoryPerCycle: scoringHistoryPerCycleIF
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

export interface scoringItemsForCompletionIF {
  lineClear: any // TODO:
}



export interface eventDataIF {
  key: string,
  strokeType: string
  action: string
}

export interface playerActionHandlersIF {
  actionLeftAndRight: Function
  actionFlip: Function
  actionSoftdrop: Function
  actionHarddrop: Function
  actionHold: Function
  actionPauseGame: Function
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
}

export interface holdQueueIF {
  swapStatus: string
  heldTetrimino: null | tetriminoIF
}

export interface levelColorsIF {
  [key: number]: string
}