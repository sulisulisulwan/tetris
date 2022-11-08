import { LevelGoals } from '../level-goals/LevelGoals.js'
import { ClassicScoring } from '../scoring/modes/Classic.js'
import { NextQueue } from '../next-queue/NextQueue.js'
import { PlayerControl } from '../player-control/PlayerControl.js'
import { ClassicRotationSystem } from '../tetriminos/movement-handler/rotation-systems/ClassicRS.js'
import { SuperRotationSystem } from '../tetriminos/movement-handler/rotation-systems/SuperRS.js'
import { 
  BasePhase,
  Pregame,
  Generation,
  FallingClassic,
  FallingExtended,
  FallingInfinite,
  LockClassic,
  LockExtended,
  LockInfinite,
  Pattern,
  Iterate,
  Animate,
  Eliminate,
  Completion,
  Off,
  GameOver
} from './index'
import { HoldQueue } from '../hold-queue/HoldQueue'
import { 
  initialOptionsIF,
  appStateIF,
  sharedHandlersIF,
  phases
} from '../../interfaces/index'

export class Engine {

  public playerControl: PlayerControl
  private tetriminoMovementHandlersMap: Map<string, any>
  private scoringHandlerMap: Map<string, any>
  private phases: phases
  private currentPhaseName: string
  private currentPhase: BasePhase

  constructor(initialOptions: initialOptionsIF) {

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
    const holdQueueHandler = new HoldQueue()

    const sharedHandlers: sharedHandlersIF = {
      tetriminoMovementHandler,
      scoringHandler,
      levelGoalsHandler,
      nextQueueHandler,
      holdQueueHandler,
      setAppState
    }

    this.phases = {
      off: new Off(sharedHandlers),
      pregame: new Pregame(sharedHandlers),
      generation: new Generation(sharedHandlers),
      falling: this.setFallingPhase(initialOptions.lockMode, sharedHandlers),
      lock: this.setLockPhase(initialOptions.lockMode, sharedHandlers),
      pattern: new Pattern(sharedHandlers, initialOptions.possibleActivePatterns),
      animate: new Animate(sharedHandlers),
      eliminate: new Eliminate(sharedHandlers),
      completion: new Completion(sharedHandlers),
      iterate: new Iterate(sharedHandlers),
      gameOver: new GameOver(sharedHandlers)
    }
    
    
    this.playerControl = new PlayerControl(sharedHandlers)

    
    this.currentPhaseName = 'off'
    this.currentPhase = this.phases.off
  }

  handleGameStateUpdate(stateData: appStateIF) {
    const { currentGamePhase } = stateData
    if (this.currentPhaseName !== stateData.currentGamePhase) {
      this.setCurrentPhaseName(currentGamePhase)
      this.setCurrentPhase(currentGamePhase)
    }
    this.currentPhase.syncToLocalState(stateData)
    this.currentPhase.execute()
  }

  setTetriminoMovementHandler(mode: string) {
    const ctor = this.tetriminoMovementHandlersMap.get(mode)
    return new ctor()
  }

  setFallingPhase(mode: string, sharedHandlers: sharedHandlersIF) {
    if (mode === 'classic') {
      return new FallingClassic(sharedHandlers)
    } else if (mode === 'extended') {
      return new FallingExtended(sharedHandlers)
    } else if (mode === 'infinite') {
      return new FallingInfinite(sharedHandlers)
    }
  }

  setLockPhase(mode: string, sharedHandlers: sharedHandlersIF) {
    if (mode === 'classic') {
      return new LockClassic(sharedHandlers)
    } else if (mode === 'extended') {
      return new LockExtended(sharedHandlers)
    } else if (mode === 'infinite') {
      return new LockInfinite(sharedHandlers)
    }
  }

  setScoringHandler(mode: string) {
    const ctor = this.scoringHandlerMap.get(mode)
    return new ctor()
  }

  setLevelGoalsHandler(mode: string) {
    return new LevelGoals(mode)
  }

  setCurrentPhase(phase: string) {
    this.currentPhase = this.phases[phase as keyof phases]
  }

  setCurrentPhaseName(phaseName: string) {
    this.currentPhaseName = phaseName
  }

}