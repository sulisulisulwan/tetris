const makeCopy = (objOrArray) => {
  return JSON.parse(JSON.stringify(objOrArray))
}

const offsetCoordsToLineBelow = (currentCoords) => {
  return currentCoords.map(coord => {
    return [coord[0] + 1, coord[1]]
  })
}

const gridCoordsAreClear = (targetCoords, currPlayField) => {
  return targetCoords.every(coord => {
    if (currPlayField[coord[0]]) { // This coordinate exists in the playable space
      if (currPlayField[coord[0]][coord[1]] !== undefined) { // This square exists in the playable space
        if (currPlayField[coord[0]][coord[1]] === '[_]') { // This square is not yet occupied
          return true
        }
      }
    } 
    return false
  }) 
}

export {
  offsetCoordsToLineBelow,
  gridCoordsAreClear,
  makeCopy
}