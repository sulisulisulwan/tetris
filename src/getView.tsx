import * as React from 'react'
import PlayView from "./visual-components/PlayView/PlayView"
import { Help, HighScore, MultiPlayer, Options, SinglePlayer } from "./visual-components/TitleView/menuOptions"
import TitleView from "./visual-components/TitleView/TitleView"

export function getView () {
  const viewMap = new Map([
    [
      'gameActive', 
      <PlayView 
        appState={this.state} 
        startQuitClickHandler={this.startQuitClickHandler} 
        playerKeystrokeHandler={this.playerKeystrokeHandler}
      />
    ],
    [
      'title', 
      <TitleView 
        appState={this.state}
        setAppState={this.setState.bind(this)}  
      />
    ],
    [
      'singlePlayer',
      <SinglePlayer
        appState={this.state}
        setAppState={this.setState.bind(this)}  
      /> 
    ],
    [
      'multiPlayer',         
      <MultiPlayer
        appState={this.state}
        setAppState={this.setState.bind(this)}  
      />
    ],
    [
      'options',
      <Options
        appState={this.state}
        setAppState={this.setState.bind(this)}  
      />
    ],
    [ 
      'highScore',
      <HighScore
        appState={this.state}
        setAppState={this.setState.bind(this)}  
      />
    ],
    [
      'loadGame',         
      <div>LOADING</div>
    ],
    [
      'help',
      <Help
        appState={this.state}
        setAppState={this.setState.bind(this)}  
      />
    ]
  ])

  return viewMap.get(this.state.view)
}
