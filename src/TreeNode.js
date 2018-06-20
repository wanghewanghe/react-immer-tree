import React from 'react'
import classnames from 'classnames'
import { closeMenu } from "./utils";

const TreeNode = ({ data, parentKey = 0, ...others }) => {
  const { checkNode, toggleNode, hasOperate, hasCheckbox } = others
  const treeNodeWrapClassnames = ({isOpen}) => classnames({
    'tree-node-wrap': true,
    'tree-node-open': isOpen,
  })
  const nodeTextClassnames = ({isDisabled}) => classnames({
    'node-text': true,
    'disabled': isDisabled,
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
            hasChildren && !node.state.isDisabled ?
            <i className="node-control" onClick={() => toggleNode(key)}/> :
            <i style={{width: 20}} />
          }

          <div className={nodeTextClassnames(node.state)}
               data-key={key}
               onClick={() => hasCheckbox && checkNode(key)}
          >
            {node.name}{key}
            {hasOperate && <i className="iconfont icon-menu" onClick={openMenu}/>}
            {hasCheckbox && <i className="iconfont icon-round" />}
            {hasCheckbox && node.state.isChecked && <i className="iconfont icon-roundcheckfill" />}
          </div>
        </div>

        {
          hasChildren &&
          <ul className="tree-children">
            <TreeNode data={node.children}
                      parentKey={key}
                      {...others}
            />
          </ul>
        }
      </li>
    )
  })
}

export default TreeNode
