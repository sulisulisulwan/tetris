import * as React from 'react'

interface multiOptionsPropsIF {
  onClickMultiOptionHandler: Function
  currentValue: [number, string]
  options: multiOptionsFieldIF
}

interface multiOptionsFieldIF {
  min: number
  max: number
  stateField: string
  optionsMap: Map<number, string>
}

const MultiOptionField = (props: multiOptionsPropsIF) => {

  const { onClickMultiOptionHandler, currentValue, options } = props

  const onClickMultiOptionWrapper = (e: any) => {
    onClickMultiOptionHandler(options)
  }

  return (
    <div>
    <button onClick={onClickMultiOptionWrapper}>&lt;</button>
    <span>{currentValue[1]}</span>
    <button onClick={onClickMultiOptionWrapper}>&gt;</button>
  </div>
  )
}

export default MultiOptionField