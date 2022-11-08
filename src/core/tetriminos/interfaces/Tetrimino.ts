export interface tetriminoIF {
  startingGridPosition: coordinates
  currentOriginOnPlayfield: coordinates
  localGridSize: number
  currentOrientation: string
  status: string
  orientations?: orientationsIF
  name?: string
  minoGraphic?: string
}

export interface orientationsIF {
  north: orientationDataIF,
  east: orientationDataIF,
  south: orientationDataIF,
  west: orientationDataIF
}

interface orientationDataIF {
  coordsOffOrigin: coordinates[]
  rotationPoints: rotationPointsIF
  lowestRowOffOrigin: number
}

export type coordinates = [number, number]

export interface rotationPointsIF {
  '1': coordinates
  '2': coordinates
  '3': coordinates
  '4': coordinates
  '5': coordinates
}