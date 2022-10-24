import { LevelGoals } from '../level-goals/LevelGoals.js'
import { ClassicScoring } from '../scoring/modes/Classic.js'
import { NextQueue } from '../next-queue/NextQueue.js'
import { PlayerControl } from '../player-control/PlayerControl.js'
import { ClassicRotationSystem } from '../tetriminos/movement-handler/rotation-systems/ClassicRS.js'
import { SuperRotationSystem } from '../tetriminos/movement-handler/rotation-systems/SuperRS.js'
import { 
  Pregame,
  Generation,
  Falling,
  Lock,
  Pattern,
  Iterate,
  Animate,
  Eliminate,
  Completion,
  Off,
  GameOver
} from './index.js'

export class Engine {

  constructor(initialOptions) {

    this.tetriminoMovementHandlersMap = new Map([
      ['classic', ClassicRotationSystem],
      ['super', SuperRotationSystem] 
    ])
    this.scoringHandlerMap = new Map([
      ['classic', ClassicScoring]
    ])

    const tetriminoMovementHandler = this.setTetriminoMovementHandler(initialOptions.rotationSystem)
    const scoringHandler = this.setScoringHandler(initialOptions.scoringSystem)
    const levelGoalsHandler = this.setLevelGoalsHandler(initialOptions.levelGoalsSystem)
    const setAppState = initialOptions.setAppState
    const nextQueueHandler = new NextQueue()

    const sharedHandlers = {
      tetriminoMovementHandler,
      scoringHandler,
      levelGoalsHandler,
      nextQueueHandler,
      setAppState
    }
    
    this.off = new Off(sharedHandlers)
    this.pregame = new Pregame(sharedHandlers)
    this.generation = new Generation(sharedHandlers)
    this.falling = new Falling(sharedHandlers)
    this.lock = new Lock(sharedHandlers)
    this.pattern = new Pattern(sharedHandlers, initialOptions.possibleActivePatterns)
    this.animate = new Animate(sharedHandlers)
    this.eliminate = new Eliminate(sharedHandlers)
    this.completion = new Completion(sharedHandlers)
    this.iterate = new Iterate(sharedHandlers)
    this.gameOver = new GameOver(sharedHandlers)
    
    this.playerControl = new PlayerControl(sharedHandlers)

    
    this.currentPhaseName = 'off'
    this.currentPhase = this.off
  }

  handleGameStateUpdate(stateData, setState) {
    const { currentGamePhase } = stateData
    if (this.currentPhase !== stateData.currentGamePhase) {
      this.setCurrentPhaseName(currentGamePhase)
      this.setCurrentPhase(currentGamePhase)
    }
    this.currentPhase.syncToLocalState(stateData)
    this.currentPhase.execute(stateData, setState)
  }

  setTetriminoMovementHandler(mode) {
    const ctor = this.tetriminoMovementHandlersMap.get(mode)
    return new ctor()
  }

  setScoringHandler(mode) {
    const ctor = this.scoringHandlerMap.get(mode)
    return new ctor()
  }

  setLevelGoalsHandler(mode) {
    return new LevelGoals(mode)
  }

  setCurrentPhase(phase) {
    this.currentPhase = this[phase]
  }

  setCurrentPhaseName(phaseName) {
    this.currentPhaseName = phaseName
  }

}