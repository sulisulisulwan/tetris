import * as React from 'react'

interface rangeFieldPropsIF {
  currentValue: number
  onClickRangeHandler: Function
  options: rangeFieldOptionsIF
}

interface rangeFieldOptionsIF {
  min: number
  max: number
  context: string
  stateField: string
}

const RangeField = (props: rangeFieldPropsIF) => {

  const { onClickRangeHandler, currentValue, options } = props
  
  const rangeHandlerWrapper = (e: any) => {
    options.context = e.target.innerHTML
    onClickRangeHandler(options)
  }

  return  (
    <div>
      <button onClick={rangeHandlerWrapper}>-</button><span>{currentValue}</span><button onClick={rangeHandlerWrapper}>+</button>
    </div>
  )
  

}

export default RangeField