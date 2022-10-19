import React from "react";
import { NextQueue } from "./next-queue/NextQueue";

const NextQueueDisplay = ({ nextqueueData }) => {

  if (false === nextqueueData instanceof NextQueue) {
    return <div className="nextqueue-wrapper">Not yet rendered</div>
  }
  
  const nextQueueForDisplay = []
  let curr = nextqueueData.peek().next
  
  for (let i = 0; i < nextqueueData.length; i += 1) {
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