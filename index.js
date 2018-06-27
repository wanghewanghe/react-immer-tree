import React from 'react'
import ReactDOM from 'react-dom'
import Tree from './src/Tree'
import './index.scss'

ReactDOM.render(
  <div>
    <Tree hasCheckbox isCheckSameId afterSelectNode="disabled" onChecked={console.log} nodeTypes={{1: <i className="iconfont icon-bumen"/>, 2: <i className="iconfont icon-profilefill"/> }}/>
    {/*<Tree hasOperate isDraggable/>*/}
  </div>,
  document.getElementById('app'))
