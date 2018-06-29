import React from 'react'
import ReactDOM from 'react-dom'
import Tree from '../src/Tree'
import '../src/Tree.scss'

const data = [{"name":"a","id": 1,"type": 1,"children":[{"name":"b","id": 2,"type": 2},{"name":"c","id": 3,"type": 2},{"name":"d","id": 4,"type": 2},{"name":"e","id": 5,"type": 2},{"name":"c","id": 3,"type": 2}]},{"name":"v","id": 6,"type": 1,"children":[{"name":"g","id": 7,"type": 2},{"name":"e","id": 5,"type": 2},{"name":"q","id": 9,"type": 1,"children":[{"name":"a","id": 1,"type": 1,"children":[{"name":"o","id": 8,"type": 2}]},{"name":"d","id": 4,"type": 2}]}]}]

ReactDOM.render(
  <div>
    {/*<Tree data={data} hasCheckbox isRadio checkSameAttr="id" afterSelectNode="one" onChecked={console.log} nodeTypes={{1: <i className="iconfont icon-bumen"/>, 2: <i className="iconfont icon-profilefill"/> }}/>*/}
    <Tree data={data} hasOperate isDraggable onDrop={console.log} nodeTypes={{1: <i className="iconfont icon-bumen"/>, 2: <i className="iconfont icon-profilefill"/> }}/>
  </div>,
  document.getElementById('app'))
