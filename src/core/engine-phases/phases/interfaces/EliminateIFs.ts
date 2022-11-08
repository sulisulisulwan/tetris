export interface eliminationActionsIF {
  eliminatorName: string
  actionData: any // TODO: this needs to be updated
}

export type eliminator = (playfield: string[][], actionData: any /* TODO: make this stronger*/) => string[][]

export interface eliminatorsIF {
  lineClear: eliminator
}

