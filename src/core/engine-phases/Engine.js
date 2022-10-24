import { LevelGoals } from '../levels-and-scoring/LevelGoals.js'
import { ClassicScoring } from '../levels-and-scoring/scoring-modes/Classic.js'
import { PlayerControl } from '../player-control/PlayerControl.js'
import { ClassicRotationSystem } from '../tetriminos/movement-handler/rotation-systems/ClassicRS.js'
import { SuperRotationSystem } from '../tetriminos/movement-handler/rotation-systems/SuperRS.js'
import { TetriminoMovementHandler } from '../tetriminos/movement-handler/TetriminoMovementHandler.js'
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
  Off
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

    const sharedHandlers = {
      tetriminoMovementHandler,
      scoringHandler,
      levelGoalsHandler
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
    
    this.playerControl = new PlayerControl(sharedHandlers)
    
    this.currentPhaseName = 'off'
    this.currentPhase = this.off
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

  handleGameStateUpdate(stateData, setState) {

    const { currentGamePhase } = stateData

    if (this.currentPhase !== stateData.currentGamePhase) {
      this.setCurrentPhaseName(currentGamePhase)
      this.setCurrentPhase(currentGamePhase)
    }

    this.currentPhase.execute(stateData, setState)
  }

}