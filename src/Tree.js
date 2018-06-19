import React from 'react'
import TreeNode from "./TreeNode";
import produce from 'immer'
import { closeMenu } from "./utils";

const data = [
  {
    name: '1-1text',
    state: {
      isOpen: true,
    },
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

const NODE_DEFAULT_STATE = {
  isOpen: false,
  isDisabled: false,
  isChecked: false,
}

const setDefaultState = (data) => produce(data, draft => {
  draft.forEach(o => {
    o.state = {
      ...NODE_DEFAULT_STATE,
      ...o.state,
    }
    if (Array.isArray(o.children) && o.children.length > 0) {
      setDefaultState(o.children)
    }
  })
})

/**
 * props list
 * propsName | valueType | defaultValue | description
 * hasOperate     boolean     false        是否有操作菜单
 * hasCheckbox    boolean     false        是否有勾选
 * onActive       function                 单击激活后的回调 // TODO
 * onChecked      function                 选中后的回调 // TODO
 **/


export default class Tree extends React.Component {
  state = {
    data: setDefaultState(data),
    selected: '',
    active_key: ''
  }

  addNode = (key) => {
    const index_arr = key.split('-').slice(1)

    const new_data = produce(this.state.data, draftState => {
      const current_data = index_arr.reduce((result, i, idx) => idx === index_arr.length - 1 ? result[i] : result[i].children, draftState)
      if (!Array.isArray(current_data.children)) {
        current_data.children = []
      }
      current_data.children.push({
        name: 'new node',
        state: NODE_DEFAULT_STATE,
      })
      current_data.state.isOpen = true
    })
    this.setState({
      data: new_data
    }, () => {
      closeMenu()
    })
  }

  deleteNode = (key) => {
    const index_arr = key.split('-').slice(1)
    const new_data = produce(this.state.data, draftState => {
      const delete_node_index = index_arr.pop()
      // 如果不是根节点
      if (index_arr.length > 0) {
        const parent_data = index_arr.reduce((result, i, idx) => idx === index_arr.length - 1 ? result[i] : result[i].children, draftState)
        parent_data.children.splice(delete_node_index, 1)
      } else {
        draftState.splice(delete_node_index, 1)
      }
    })
    this.setState({
      data: new_data
    }, () => {
      closeMenu()
    })
  }

  editNode = (key) => {
    const index_arr = key.split('-').slice(1)
    const new_data = produce(this.state.data, draftState => {
      const current_data = index_arr.reduce((result, i, idx) => idx === index_arr.length - 1 ? result[i] : result[i].children, draftState)
      current_data.name += 'edited'
    })
    this.setState({
      data: new_data
    }, () => {
      closeMenu()
    })
  }

  toggleNode = (key) => {
    const index_arr = key.split('-').slice(1)
    const new_data = produce(this.state.data, draftState => {
      const current_data = index_arr.reduce((result, i, idx) => idx === index_arr.length - 1 ? result[i] : result[i].children, draftState)
      current_data.state.isOpen = !current_data.state.isOpen
    })
    this.setState({
      data: new_data
    })
  }

  handleClick = (event) => {
    const { target } = event
    if (target.className === 'node-text') {
      const $activeNode = document.querySelector('.node-text.active')
      if ($activeNode) {
        $activeNode.className = 'node-text'
      }
      target.classList.add('active')
      this.setState({
        active_key: target.getAttribute('data-key')
      })
    }
  }

  handleWrapClick = event => {
    closeMenu()
  }

  render() {
    const {
      data,
      selected,
      active_key,
    } = this.state
    return (
      <div className="tree-wrap" onClick={this.handleWrapClick}>
        <p>selected key: {selected}</p>
        <ul onClick={(e) => this.handleClick(e)}>
          <TreeNode data={data}
                    addNode={this.addNode}
                    deleteNode={this.deleteNode}
                    editNode={this.editNode}
                    toggleNode={this.toggleNode}
          />
        </ul>
        <ul className="operate-menu" onClick={e => e.stopPropagation()}>
          <li onClick={() => this.addNode(active_key)}>添加子部门</li>
          <li onClick={() => this.editNode(active_key)}>修改名称</li>
          <li onClick={() => this.deleteNode(active_key)}>删除</li>
        </ul>
      </div>
    )
  }
}
