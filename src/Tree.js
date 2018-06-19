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
      { name: '2-1text', id: 21 },
      { name: "2-2text", id: 22 },
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
      { name: '2-1text', id: 21 },
      { name: "2-2text", id: 22},
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
 * propsName    | valueType | defaultValue | description
 * hasOperate     boolean     false        是否有操作菜单
 * hasCheckbox    boolean     false        是否有勾选
 * isDisabledChecked boolean  true         是否勾选后禁用
 * isCheckSameId  boolean     false        是否勾选相同id的项
 * isRadio        boolean     false        是否单选
 * onActive       function                 单击激活后的回调 // TODO
 * onChecked      function                 选中后的回调 // TODO
 **/


export default class Tree extends React.Component {
  static defaultProps = {
    isDisabledChecked: true,
    hasOperate: false,
    hasCheckbox: false,
    isCheckSameId: false,
    isRadio: false
  }
  state = {
    data: setDefaultState(data),
    selected: [],
    active_key: '',
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

  checkNode = (key) => {
    const index_arr = key.split('-').slice(1)
    let { selected } = this.state
    let current_id

    let new_data = produce(this.state.data, draftState => {
      if (this.props.isRadio) {
        const setSameIdChecked = (data) => {
          data.forEach(o => {
            if (o.state.isChecked) {
              o.state = {
                isChecked: false,
                isDisabled: this.props.isDisabledChecked && false
              }
            }
            if (Array.isArray(o.children) && o.children.length > 0) {
              setSameIdChecked(o.children)
            }
          })
        }
        setSameIdChecked(draftState)
        selected = []
      }
      const current_data = index_arr.reduce((result, i, idx) => idx === index_arr.length - 1 ? result[i] : result[i].children, draftState)
      if (!current_data.state.isChecked) {
        current_id = current_data.id
        selected.push({
          ...current_data,
          key: `result${key}`
        })
        current_data.state.isChecked = true
        current_data.state.isOpen = false
        if (this.props.isDisabledChecked) {
          current_data.state.isDisabled = true
        }
      }
    })

    if (this.props.isCheckSameId) {
      new_data = produce(new_data, draftState => {
        const setSameIdChecked = (data) => {
          data.forEach(o => {
            if (o.id && o.id === current_id) {
              o.state = {
                isChecked: true,
                isDisabled: this.props.isDisabledChecked
              }
            }
            if (Array.isArray(o.children) && o.children.length > 0) {
              setSameIdChecked(o.children)
            }
          })
        }
        setSameIdChecked(draftState)
      })
    }

    this.setState({
      data: new_data,
      selected,
    })
  }

  unCheckNode = (key, index) => {
    const index_arr = key.replace('result', '').split('-').slice(1)
    const { selected } = this.state
    let current_id

    let new_data = produce(this.state.data, draftState => {
      const current_data = index_arr.reduce((result, i, idx) => idx === index_arr.length - 1 ? result[i] : result[i].children, draftState)
      if (current_data.state.isChecked) {
        current_id = current_data.id
        selected.splice(index, 1)
        current_data.state.isChecked = false
        if (this.props.isDisabledChecked) {
          current_data.state.isDisabled = false
        }
      }
    })

    if (this.props.isCheckSameId) {
      new_data = produce(new_data, draftState => {
        const setSameIdChecked = (data) => {
          data.forEach(o => {
            if (o.id && o.id === current_id) {
              o.state = {
                isChecked: false,
                isDisabled: this.props.isDisabledChecked && false
              }
            }
            if (Array.isArray(o.children) && o.children.length > 0) {
              setSameIdChecked(o.children)
            }
          })
        }
        setSameIdChecked(draftState)
      })
    }

    this.setState({
      data: new_data,
      selected,
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

  toggleActive = (event) => {
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
    const {
      hasOperate,
      hasCheckbox,
    } = this.props
    return (
      <div className="tree-wrap" onClick={this.handleWrapClick}>
        <ul>selected key:
          {
            selected.map((o, i) =>
              <li key={o.key} onClick={() => this.unCheckNode(o.key, i)}>{o.name}</li>
            )
          }
        </ul>
        <ul onClick={(e) => hasOperate && this.toggleActive(e)}>
          <TreeNode data={data}
                    toggleNode={this.toggleNode}
                    checkNode={this.checkNode}
                    hasOperate={hasOperate}
                    hasCheckbox={hasCheckbox}
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
