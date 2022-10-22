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

  constructor(initialGameState) {
    
    this.off = new Off()
    this.pregame = new Pregame()
    this.generation = new Generation()
    this.falling = new Falling()
    this.lock = new Lock()
    this.pattern = new Pattern(initialGameState)
    this.animate = new Animate()
    this.eliminate = new Eliminate(initialGameState)
    this.completion = new Completion()
    this.iterate = new Iterate()
    
    this.currentPhaseName = 'off'
    this.currentPhase = this.off
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