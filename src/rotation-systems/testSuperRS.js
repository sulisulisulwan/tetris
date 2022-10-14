import { SuperRotatingSystem  } from "./SuperRS.js";
import { OTetrimino } from "../components/tetriminos/OTetrimino.js";
import { ITetrimino } from "../components/tetriminos/ITetrimino.js";
import { TTetrimino } from "../components/tetriminos/TTetrimino.js";
import { JTetrimino } from "../components/tetriminos/JTetrimino.js";
import { LTetrimino } from "../components/tetriminos/LTetrimino.js";
import { STetrimino } from "../components/tetriminos/STetrimino.js";
import { ZTetrimino } from "../components/tetriminos/ZTetrimino.js";

const superRotatingSystem = new SuperRotatingSystem()
const oTetrimino = new OTetrimino()
const iTetrimino = new ITetrimino()
const tTetrimino = new TTetrimino()
const jTetrimino = new JTetrimino()
const lTetrimino = new LTetrimino()
const sTetrimino = new STetrimino()
const zTetrimino = new ZTetrimino()


const options = {
  testTheseOrientations: ['north', 'east','south','west']
}

superRotatingSystem.testFlipPoints(oTetrimino, options)
// superRotatingSystem.testFlipPoints(iTetrimino, options)
// superRotatingSystem.testFlipPoints(tTetrimino, options)
// superRotatingSystem.testFlipPoints(jTetrimino, options)
// superRotatingSystem.testFlipPoints(lTetrimino, options)
// superRotatingSystem.testFlipPoints(sTetrimino, options)
// superRotatingSystem.testFlipPoints(zTetrimino, options)


