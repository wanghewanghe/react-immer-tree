import React from 'react'
import classnames from 'classnames'
import { closeMenu } from "./utils";

const TreeNode = ({ data, parentKey = 0, ...others }) => {
  const {
    checkNode,
    toggleNode,
    hasOperate,
    hasCheckbox,
    isDraggable,
    dragStart,
    dragEnd,
    moveNode,
    dragOver,
    dragEnter,
    keyTextMap,
    matchedKeys,
  } = others
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
    keyTextMap[key] = node.name
    return (
      <li key={key} className={treeNodeWrapClassnames(node.state)}>
        {
          (matchedKeys.length ? matchedKeys.some(o => o === key) : true) &&
          <div className="tree-node">
            {
              hasChildren && !node.state.isDisabled ?
                <i className="node-control" onClick={() => toggleNode(key)}/> :
                <i style={{width: 20}} />
            }

            <div className={nodeTextClassnames(node.state)}
                 data-key={key}
                 onClick={() => hasCheckbox && checkNode(key)}
                 draggable={!hasCheckbox && isDraggable}
                 onDragStart={dragStart}
                 onDragEnd={dragEnd}
                 onDragEnter={dragEnter}
                 onDragOver={dragOver}
                 onDragLeave={e => {
                   e.target.style = ''
                 }}
                 onDrop={moveNode}
            >
              <span>{node.name}</span>
              {hasOperate && <i className="iconfont icon-menu"
                                onClick={openMenu}
                                onDragOver={e => e.stopPropagation()}
              />}
              {hasCheckbox && <i className="iconfont icon-round" />}
              {hasCheckbox && node.state.isChecked && <i className="iconfont icon-roundcheckfill" />}
            </div>
          </div>
        }

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
