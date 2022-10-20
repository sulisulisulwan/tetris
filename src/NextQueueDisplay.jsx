import React from "react";

const NextQueueDisplay = ({ nextQueueData }) => {

  if (nextQueueData === null) {
    return <div className="nextqueue-wrapper">Not yet rendered</div>
  }
  
  const nextQueueForDisplay = []
  let curr = nextQueueData.peek().next
  
  for (let i = 0; i < nextQueueData.length; i += 1) {
    nextQueueForDisplay.push(curr.tetrimino.name)
    curr = curr.next
  }

  return(
    <div className="nextqueue-wrapper">
      <div className="text-next">Next</div>
      {nextQueueForDisplay.map((tetriminoName, i)=> <div className="next-tetriminos" key={`${tetriminoName}-${i}`}>{tetriminoName}</div>)}
    </div>
  )
}

export default NextQueueDisplay