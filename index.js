import React from 'react'
import ReactDOM from 'react-dom'
import Tree from './src/Tree'
import './index.scss'

ReactDOM.render(
  <div>
    <Tree hasCheckbox isCheckSameId isRadio/>
  </div>,
  document.getElementById('app'))
