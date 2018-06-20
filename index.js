import React from 'react'
import ReactDOM from 'react-dom'
import Tree from './src/Tree'
import './index.scss'

ReactDOM.render(
  <div>
    <Tree hasCheckbox isCheckSameId onUnchecked={console.log}/>
    {/*<Tree hasOperate/>*/}
  </div>,
  document.getElementById('app'))
