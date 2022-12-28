import * as React from 'react'

interface toggleFieldPropsIF {
  onClickToggleHandler: Function
  currentValue: boolean
  options: toggleFieldOptionsIF
}

interface toggleFieldOptionsIF {
  stateField: string
}

const ToggleField = (props: toggleFieldPropsIF) => {

  const { onClickToggleHandler, currentValue, options } = props

  const onClickToggleWrapper = (e: any) => {
    onClickToggleHandler(options)
  }
  
  return (
    <div>
      <button onClick={onClickToggleWrapper}>&lt;</button>
      {currentValue ? 'ON' : 'OFF'}
      <button onClick={onClickToggleWrapper}>&gt;</button>
    </div>
  )

}

export default ToggleField