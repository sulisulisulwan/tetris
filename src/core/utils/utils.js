
const makeCopy = (objOrArray, strokeType) => {

  if (Array.isArray(objOrArray)) {
    const obj = {}

    objOrArray.forEach((row, i) => {
      obj[i] = {}
      row.forEach((square, j) => {
        obj[i][j] = square
      })
    })

    const stringified = JSON.stringify(objOrArray)
    const parsed = JSON.parse(stringified)

    const newArray = new Array(40)

    for (const row in parsed) {
      const rowAsNum = +row
      newArray[rowAsNum] = []
      for (const square in parsed[row]) {
        newArray[rowAsNum][+square] = parsed[row][square]
      }
    }

    return newArray

  }

  const stringified = JSON.stringify(objOrArray)
  const parsed = JSON.parse(stringified)
  return parsed
  // return JSON.parse(JSON.stringify(objOrArray))
}

const offsetCoordsToLineBelow = (currentCoords) => {
  return currentCoords.map(coord => {
    return [coord[0] + 1, coord[1]]
  })
}

export {
  offsetCoordsToLineBelow,
  makeCopy
}