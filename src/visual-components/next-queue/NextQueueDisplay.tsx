import * as React from "react";
import TetriminoTile from '../TetriminoTile'
import { levelColors } from '../levelColors'
import { tetriminoGraphics } from "../tetriminoGraphics"; 
import { tetriminoGraphicsIF } from "../../interfaces";

interface nextQueueDisplayPropsIF {
  nextQueueData: string[]
  currentLevel: number
}


const NextQueueDisplay = (props: nextQueueDisplayPropsIF) => {
  
  const { nextQueueData, currentLevel } = props

  const styles: React.CSSProperties = {
    padding: '10px',
    border: 'gray 2px solid',
    height: '100%',
    width: '120px',
    backgroundColor: levelColors[currentLevel],
    textAlign: 'center'
  }
  
  if (nextQueueData === null) {
    return <div className="nextqueue-wrapper" style={styles}><div className="text-next">Next</div></div>
  }  

  

  return(
    <div className="nextqueue-wrapper" style={styles}>
      <div className="text-next">Next</div>
      {nextQueueData.map((tetriminoName, i)=> {
        const graphicGrid = tetriminoGraphics[`${tetriminoName}Graphic` as keyof tetriminoGraphicsIF]
        return <TetriminoTile key={`${tetriminoName}-${i}`} graphicGrid={graphicGrid} tetriminoName={tetriminoName} classType={'next'}/>
        
      })}
    </div>
  )

}

export default NextQueueDisplay