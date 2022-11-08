import { setAppStateIF } from "./AppState"

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
