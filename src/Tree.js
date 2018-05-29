import React from 'react'
import TreeNode from "./TreeNode";
import produce from 'immer'

const data = [
  {
    name: '1-1text',
    children: [
      { name: '2-1text' },
      { name: "2-2text" },
      {
        name: '2-3text', children: [
          {
            name: '3-1text', children: [
              { name: '4-1text' }
            ]
          },
          { name: '3-2text' }
        ]
      }
    ],
  }, {
    name: '1-2',
    children: [
      { name: '2-1text' },
      { name: "2-2text" },
      {
        name: '2-3text', children: [
          {
            name: '3-1text', children: [
              { name: '4-1text' }
            ]
          },
          { name: '3-2text' }
        ]
      }
    ],
  }
]

export default class Tree extends React.Component {
  state = {
    data: data,
    selected: '',
  }

  nodeAction = (action, key) => {
    const index_arr = key.split('-').slice(1)
    let new_data = this.state.data
    if (action === 'add') {
      new_data = produce(this.state.data, draftState => {
        const current_data = index_arr.reduce((result, i, idx) => idx === index_arr.length - 1 ? result[i] : result[i].children, draftState)
        if (!Array.isArray(current_data.children)) {
          current_data.children = []
        }
        current_data.children.push({
          name: 'new node'
        })
      })
    }
    if (action === 'delete') {
      new_data = produce(this.state.data, draftState => {
        const delete_node_index = index_arr.pop()
        // 如果不是根节点
        if (index_arr.length > 0) {
          const parent_data = index_arr.reduce((result, i, idx) => idx === index_arr.length - 1 ? result[i] : result[i].children, draftState)
          parent_data.children.splice(delete_node_index, 1)
        } else {
          draftState.splice(delete_node_index, 1)
        }
      })
    }
    if (action === 'edit') {
      new_data = produce(this.state.data, draftState => {
        const current_data = index_arr.reduce((result, i, idx) => idx === index_arr.length - 1 ? result[i] : result[i].children, draftState)
        current_data.name += 'edited'
      })
    }
    this.setState({
      data: new_data
    })
  }

  render() {
    const {
      data,
      selected,
    } = this.state
    return (
      <div className="tree-wrap">
        <p>selected key: {selected}</p>
        <TreeNode data={data}
                  addNode={(key) => this.nodeAction('add', key)}
                  deleteNode={(key) => this.nodeAction('delete', key)}
                  editNode={(key) => this.nodeAction('edit', key)}
        />
      </div>
    )
  }
}
