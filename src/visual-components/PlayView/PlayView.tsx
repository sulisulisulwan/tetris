import * as React from 'react'

import PlayfieldGrid from './playfield/PlayfieldGrid'
import NextQueueDisplay from './next-queue/NextQueueDisplay'
import StartQuitButton from './StartQuitButton'
import ScoreDisplay from './score-display/ScoreDisplay'

import HoldQueueDisplay from './hold-queue/HoldQueueDisplay'

import { appStateIF, initialOptionsIF, setAppStateIF } from '../../interfaces'

interface playViewPropsIF {
  appState: appStateIF
  startQuitClickHandler: (e: Event) => void
  playerKeystrokeHandler: React.KeyboardEventHandler<HTMLDivElement>
}

  const PlayView = (props: playViewPropsIF ) => {

  const { appState, startQuitClickHandler, playerKeystrokeHandler } = props
  return (
    <div className="game-app-wrapper">
      <div className="game-title" onKeyDown={playerKeystrokeHandler}>SULI'S TETRIS</div>
      {appState.currentGamePhase === 'pregame' ? <div style={{textAlign: 'center'}}>{appState.pregameCounter + 1}</div> : <div style={{textAlign: 'center'}}> --- </div>}
      <div className="game-screen">
        <div className='game-screen-left'>
          <HoldQueueDisplay 
            holdQueue={appState.holdQueue} 
            currentLevel={appState.currentLevel}
          />
          <ScoreDisplay 
            totalScore={appState.totalScore} 
            currentLevel={appState.currentLevel} 
            linesCleared={appState.totalLinesCleared}
          />
        </div>
        <div className='game-screen-center'>
          <PlayfieldGrid 
            playfieldData={appState.playfield.slice(20)}
            currentLevel={appState.currentLevel}  
          />
        </div>
        <div className='game-screen-right'>
          <NextQueueDisplay 
            nextQueueData={appState.nextQueue}
            currentLevel={appState.currentLevel} 
          />
        </div>
      </div>
      <StartQuitButton currentGamePhase={appState.currentGamePhase} clickHandler={startQuitClickHandler}/>
    </div>
  )
}

export default PlayView