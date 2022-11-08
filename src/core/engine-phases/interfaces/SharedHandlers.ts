import { setAppStateIF } from "../../../interfaces"
import { HoldQueue } from "../../hold-queue/HoldQueue"
import { LevelGoals } from "../../level-goals/LevelGoals"
import { NextQueue } from "../../next-queue/NextQueue"
import { Scoring } from "../../scoring/Scoring"
import { TetriminoMovementHandler } from "../../tetriminos/movement-handler/TetriminoMovementHandler"

export interface sharedHandlersIF {
  tetriminoMovementHandler: TetriminoMovementHandler
  scoringHandler: Scoring
  levelGoalsHandler: LevelGoals
  nextQueueHandler: NextQueue
  holdQueueHandler: HoldQueue
  setAppState: setAppStateIF
}