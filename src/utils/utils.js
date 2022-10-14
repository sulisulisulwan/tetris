

const gridCoordsAreClear = (targetCoords, currPlayField) => {
  return targetCoords.every(coord => {
    if (currPlayField[coord[0]]) { // This coordinate exists in the playable space
      if (currPlayField[coord[0]][coord[1]] !== undefined) { // This square exists in the playable space
        if (currPlayField[coord[0]][coord[1]] !== null) { // This square is not yet occupied
          return true
        }
      }
    } 
    return false
  }) 
}

export {
  gridCoordsAreClear
}