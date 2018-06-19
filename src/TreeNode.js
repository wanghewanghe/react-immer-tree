import React from 'react'
import classnames from 'classnames'
import { closeMenu } from "./utils";

const TreeNode = ({ data, parentKey = 0, ...methods }) => {
  const { toggleNode } = methods
  const treeNodeWrapClassnames = ({isOpen}) => classnames({
    'tree-node-wrap': true,
    'tree-node-open': isOpen
  })
  const openMenu = event => {
    event.stopPropagation()
    closeMenu()
    const $menu = document.querySelector('.operate-menu')
    $menu.classList.toggle('open')
    $menu.style.left = event.clientX - 50 + 'px'
    $menu.style.top = event.clientY + 10 + 'px'
  }
  return data.map((node, idx) => {
    const key = `${parentKey}-${idx}`
    const hasChildren = node.children && node.children.length > 0
    return (
      <li key={key} className={treeNodeWrapClassnames(node.state)}>
        <div className="tree-node">
          {
            hasChildren ?
            <i className="node-control" onClick={() => toggleNode(key)}/> :
            <i style={{width: 20}} />
          }

          <div className="node-text" data-key={key}>
            {node.name}{key}
            <i className="iconfont icon-menu" onClick={openMenu}/>
          </div>
        </div>

        {
          hasChildren &&
          <ul className="tree-children">
            <TreeNode data={node.children}
                      parentKey={key}
                      {...methods}
            />
          </ul>
        }
      </li>
    )
  })
}

export default TreeNode
