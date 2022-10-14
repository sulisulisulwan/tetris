import { Pregame } from './phases/Pregame.js'
import { Generation } from './phases/Generation.js'
import { Falling } from './phases/Falling.js'
import { Lock } from './phases/Lock.js'
import { Pattern } from './phases/Pattern.js'
import { Iterate } from './phases/Iterate.js'
import { Animate } from './phases/Animate.js'
import { Eliminate } from './phases/Eliminate.js'
import { Completion } from './phases/Completion.js'


class Engine {

  constructor() {
    // this.phaseMap = this.setPhaseMap()
    this.currentPhase = 'pregame'

    this.pregame = new Pregame()
    this.generation = new Generation()
    this.falling = new Falling()
    this.lock = new Lock()
    this.pattern = new Pattern()
    this.animate = new Animate()
    this.eliminate = new Eliminate()
    this.completion = new Completion()
  }

  // setPhaseMap() {
  //   return new Map([
  //     ['pregame', Pregame]
  //     ['generation', Generation],
  //     ['falling', Falling],
  //     ['lock', Lock],
  //     ['pattern', Pattern],
  //     ['iterate', Iterate],
  //     ['animate', Animate],
  //     ['eliminate', Eliminate],
  //     ['completion', Completion],
  //   ])
  // }


}