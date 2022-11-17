import { actionItemIF, appStateIF, genericObjectIF, patternScannersIF, patternItemIF, possibleActivePatternsIF, scoreItemIF, sharedHandlersIF } from "../../../interfaces";
import BasePhase from "./BasePhase";




export default class Pattern extends BasePhase {

  private patternsToMatch: string[]
  private patternScanners: patternScannersIF
  constructor(
    sharedHandlers: sharedHandlersIF, 
    possibleActivePatterns: possibleActivePatternsIF
  ) {
    super(sharedHandlers)
    this.patternsToMatch = this.loadPatternsToMatch(possibleActivePatterns)
    this.patternScanners = {
      lineClear: this.lineClear.bind(this)
    }
  }

  execute() {
    // console.log('>>>> PATTERN PHASE')
    const newState = {} as appStateIF
    newState.patternItems = this.runPatternScanners() 
    newState.currentGamePhase = newState.patternItems.length ? 'updateScore' : 'completion' // If there are no patterns to process through elimination, animation, and iteration, skip to completion.
    this.setAppState(newState)
  }

  private runPatternScanners() {
    const patternsToMatch = this.patternsToMatch
    const foundPatterns: patternItemIF[] = []

    patternsToMatch.forEach(pattern => {
      const scanner = this.patternScanners[pattern as keyof patternScannersIF]
      const foundPattern = scanner()
      if (foundPattern) { 
        foundPatterns.push(foundPattern)
      }
    })

    return foundPatterns
  }

  private loadPatternsToMatch(possibleActivePatterns: possibleActivePatternsIF): string[] {
    const patternsToLoad = []

    for (const pattern in possibleActivePatterns) {
      const currPatternActive = possibleActivePatterns[pattern as keyof possibleActivePatternsIF]
      if (currPatternActive) {
        patternsToLoad.push(pattern)
      }
    }

    return patternsToLoad
  }

  private lineClear(): patternItemIF | null {
    const rowsToClear: number[] = []
    const { playfield } = this.localState

    playfield.forEach((row, index) => {
      if (row.every(square => square !== '[_]')) {
        rowsToClear.push(index)
      }
    })

    let lineClearPatternItem: patternItemIF | null = null

    if (rowsToClear.length) {
      lineClearPatternItem = {
        type: 'lineClear',
        action: 'eliminate',
        data: {
          linesCleared: rowsToClear.length,
          rowsToClear: rowsToClear
        }
      }  
    }

    return lineClearPatternItem
  }

}

/**
 * In this phase, the engine looks for patterns made from Locked down Blocks in the Matrix. 
 * once a pattern has been matched, it can trigger any number of tetris variant-related effects.
 * the classic pattern is the Line Clear pattern. this pattern is matched when one or more rows 
 * of 10 horizontally aligned Matrix cells are occupied by Blocks. the matching Blocks are then 
 * marked for removal on a hit list. Blocks on the hit list are cleared from the Matrix at a later 
 * time in the eliminate Phase.
 */