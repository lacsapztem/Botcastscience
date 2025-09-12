import React from 'react'

export default class Main extends React.Component {

  constructor() {
    super()
    this.state = {inputValue: ''}
  }

  render() {
    return (
      <div>
        <input value={this.state.inputValue} onChange={e => this.UpdateInputValue(e)}/>
        <p>Input: {this.state.inputValue}</p>
      </div>
    )
  }
  // Notation of function by Stage-0
  UpdateInputValue = (e) => {
    this.setState({inputValue: e.target.value})
  }
}