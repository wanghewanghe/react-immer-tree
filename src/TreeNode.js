import React from 'react'

const TreeNode = ({data, parentKey = 0, addNode, deleteNode}) => {
  return data.map((node, idx) => {
    const key = `${parentKey}-${idx}`
    return (
      <li key={key}>
        <span>
          <i onClick={() => addNode(key)}>+</i>
          {node.name}{key}
          <i onClick={() => deleteNode(key)}>delete</i>
        </span>
        {
          node.children && node.children.length > 0 &&
          <ul>
            <TreeNode data={node.children}
                      addNode={addNode}
                      deleteNode={deleteNode}
                      parentKey={key}
            />
          </ul>
        }
      </li>
    )
  })
}

export default TreeNode
