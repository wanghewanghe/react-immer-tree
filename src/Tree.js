import React from 'react'
import TreeNode from "./TreeNode";
import produce from 'immer'
import { closeMenu, getNodeByIndexArr, produceNewData, recursiveTreeData } from "./utils";

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
  recursiveTreeData(draft)(data => {
    data.state = {
      ...NODE_DEFAULT_STATE,
      ...data.state,
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
 * onChecked      function                 选中后的回调
 * onUnchecked    function                 取消选中后的回调
 * beforeAdd      function                 菜单中添加子节点添加前的回调，需要返回true
 * onAdd          function                 菜单中添加子节点(返回值为子节点信息{name: xxx, state: xxx})
 * beforeDelete   function                 菜单中删除节点前的回调，需要返回true
 * beforeEdit     function                 菜单中修改名称前的回调，需要返回true
 * onEdit         function                 菜单中修改名称，返回编辑的子节点名字
 **/

export default class Tree extends React.Component {
  static defaultProps = {
    isDisabledChecked: true,
    hasOperate: false,
    hasCheckbox: false,
    isCheckSameId: false,
    isRadio: false,
    beforeAdd: () => true,
    onAdd: () => ({}),
    beforeDelete: () => true,
    beforeEdit: () => true,
    onEdit: () => {},
    onChecked: () => {},
    onUnchecked: () => {},
  }
  state = {
    data: setDefaultState(data),
    selected: [],
    active_key: '',
  }

  addNode = (key) => {
    if (this.props.beforeAdd()) {
      const new_data = produceNewData(key, this.state.data, current_data => {
        if (!Array.isArray(current_data.children)) {
          current_data.children = []
        }
        const node_info = {
          name: 'new node',
          state: NODE_DEFAULT_STATE,
          ...this.props.onAdd(),
        }
        current_data.children.push(node_info)
        current_data.state.isOpen = true
      })
      this.setState({
        data: new_data
      }, () => {
        closeMenu()
      })
    }
  }

  deleteNode = (key) => {
    if (this.props.beforeDelete()) {
      const index_arr = key.split('-').slice(1)
      const new_data = produce(this.state.data, draftState => {
        const delete_node_index = index_arr.pop()
        // 如果不是根节点
        if (index_arr.length > 0) {
          const parent_data = getNodeByIndexArr(index_arr, draftState)
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
  }

  editNode = (key) => {
    if (this.props.beforeEdit()) {
      const new_name = this.props.onEdit() || 'edited name'
      const new_data = produceNewData(key, this.state.data, current_data => {
        current_data.name = new_name
      })

      this.setState({
        data: new_data
      }, () => {
        closeMenu()
      })
    }
  }

  checkNode = (key) => {
    const index_arr = key.split('-').slice(1)
    let { selected } = this.state
    let current_id

    let new_data = produce(this.state.data, draftState => {
      // 如果单选则先全部取消勾选
      if (this.props.isRadio) {
        const resetCheckedState = () => {
          recursiveTreeData(draftState)(o => {
            if (o.state.isChecked) {
              this.setCheckedState(false, o)
            }
          })
        }
        resetCheckedState()
        selected = []
      }
      // 勾选操作
      const current_data = getNodeByIndexArr(index_arr, draftState)
      if (!current_data.state.isChecked) {
        current_id = current_data.id
        selected.push({
          ...current_data,
          state: {...current_data.state},
          key: `result${key}`
        })
        current_data.state.isOpen = false
        this.setCheckedState(true, current_data)
      }
    })
    // 勾选相同id的节点
    if (this.props.isCheckSameId) {
      new_data = produce(new_data, draftState => {
        recursiveTreeData(draftState)(o => {
          this.setSameIdChecked(true, o, current_id)
        })
      })
    }

    this.props.onChecked(selected)

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
      const current_data = getNodeByIndexArr(index_arr, draftState)
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
        recursiveTreeData(draftState)(o => {
          this.setSameIdChecked(false, o, current_id)
        })
      })
    }

    this.props.onUnchecked(selected)
    
    this.setState({
      data: new_data,
      selected,
    })
  }

  toggleNode = (key) => {
    const new_data = produceNewData(key, this.state.data, current_data => {
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

  setCheckedState = (isChecked, data) => {
    data.state.isChecked = isChecked
    if (this.props.isDisabledChecked) {
      data.state.isDisabled = isChecked
    }
  }

  setSameIdChecked = (isChecked, data, current_id) => {
    if (data.id && data.id === current_id) {
      this.setCheckedState(isChecked, data)
    }
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
