import React from 'react'
import TreeNode from "./TreeNode"
import produce from 'immer'
import { closeMenu, getDropPosition, getNodeByIndexArr, produceNewData, recursiveTreeData } from "./utils"
import './Tree.scss'

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

export default class Tree extends React.Component {
  static defaultProps = {
    data: [],
    afterSelectNode: 'disabled',
    hasOperate: false,
    hasCheckbox: false,
    hasSearch: false,
    checkSameAttr: '',
    isRadio: false,
    isDraggable: false,
    nodeTypes: {},
    beforeAdd: () => true,
    onAdd: () => ({}),
    beforeDelete: () => true,
    beforeEdit: () => true,
    onEdit: () => 'edited name',
    onChecked: () => {},
    onUnchecked: () => {},
    resultNode: () => {},
    noSearchData: () => {},
  }
  original_data = setDefaultState(this.props.data)
  state = {
    data: this.original_data,
    selected: [],
    active_key: '',
    no_search_data: false,
    matched_keys: [],
  }

  drag_node_key = ''
  drag_relative_index = 0
  keyTextMap = {}

  searchNode = e => {
    if (e.keyCode === 13) {
      if (e.target.value !== '') {
        const matched_keys = Object.entries(this.keyTextMap).reduce((result, o) => {
          if (o[1].includes(e.target.value)) {
            o[0].split('-').reduce((key, index) => {
              const res = key + '-' + index
              result.push(res)
              return res
            })
          }
          return result
        }, [])

        this.setState({
          matched_keys,
          no_search_data: !matched_keys.length,
        })
      } else {
        this.setState({
          matched_keys: [],
          no_search_data: false,
        })
      }
    }
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
      const new_name = this.props.onEdit()
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
    const {
      isRadio,
      checkSameAttr,
      afterSelectNode,
      onChecked,
    } = this.props
    const current_ids = new Set()
    let { selected } = this.state
    let is_current_checked

    let new_data = produce(this.state.data, draftState => {
      // 如果单选则先全部取消勾选
      if (isRadio) {
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
        is_current_checked = false
        current_ids.add(current_data[checkSameAttr])
        selected.push({
          ...current_data,
          state: { ...current_data.state },
          key: `result${key}`
        })
        this.setCheckedState(true, current_data)

        // 全选
        if (afterSelectNode === 'all') {
          if (Array.isArray(current_data.children)) {
            const checkAll = (data, key) => {
              data.children.forEach((o, i) => {
                this.setCheckedState(true, o)
                // 同级去重
                if (!current_ids.has(o[checkSameAttr])) {
                  selected.push({
                    ...o,
                    state: { ...o.state },
                    key: `${key}-${i}`
                  })
                }
                current_ids.add(o[checkSameAttr])
                if (Array.isArray(o.children)) {
                  checkAll(o, `${key}-${i}`)
                }
              })
            }
            checkAll(current_data, `result${key}`)
          }
        }

      } else if (afterSelectNode !== 'disabled') {
        // 非选中后禁用才可以再次点击取消勾选
        is_current_checked = true
        current_ids.add(current_data[checkSameAttr])
        selected = selected.filter(o => o.key !== `result${key}`)
        this.setCheckedState(false, current_data)

        // 全反选
        if (afterSelectNode === 'all') {
          if (Array.isArray(current_data.children)) {
            const unCheckAll = (data, key) => {
              data.children.forEach((o, i) => {
                this.setCheckedState(false, o)
                selected = selected.filter(o => o.key !== `${key}-${i}`)
                current_ids.add(o[checkSameAttr])
                if (Array.isArray(o.children)) {
                  unCheckAll(o, `${key}-${i}`)
                }
              })
            }
            unCheckAll(current_data, `result${key}`)
          }
        }
      }
    })
    // 勾选相同id的节点
    if (checkSameAttr) {
      new_data = produce(new_data, draftState => {
        recursiveTreeData(draftState)(node => {
          this.setSameIdChecked(!is_current_checked, node, current_ids)
        })
      })
    }

    onChecked(selected)

    this.setState({
      data: new_data,
      selected,
    })
  }

  unCheckNode = (key, index) => {
    const index_arr = key.replace('result', '').split('-').slice(1)
    const { selected } = this.state
    const {
      checkSameAttr,
      onUnchecked,
    } = this.props
    const current_ids = new Set()

    let new_data = produce(this.state.data, draftState => {
      const current_data = getNodeByIndexArr(index_arr, draftState)
      if (current_data.state.isChecked) {
        selected.splice(index, 1)
        current_ids.add(current_data[checkSameAttr])
        this.setCheckedState(false, current_data)
      }
    })

    if (checkSameAttr) {
      new_data = produce(new_data, draftState => {
        recursiveTreeData(draftState)(o => {
          this.setSameIdChecked(false, o, current_ids)
        })
      })
    }

    onUnchecked(selected)

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

  dragStart = event => {
    event.target.style.background = '#e6f7ff'
    this.drag_node_key = event.target.getAttribute('data-key')
    const $activeNode = document.querySelector('.node-text.active')
    if ($activeNode) {
      $activeNode.className = 'node-text'
    }
    const new_data = produceNewData(this.drag_node_key, this.state.data, current_data => {
      current_data.state.isOpen = false
    })
    this.setState({
      data: new_data
    })
  }

  dragEnd = event => {
    event.target.style = ''
    this.drag_node_key = ''
  }

  dragEnter = event => {
    event.preventDefault()
    const new_data = produceNewData(event.target.getAttribute('data-key'), this.state.data, current_data => {
      current_data.state.isOpen = true
    })
    this.setState({
      data: new_data
    })
  }

  dragOver = event => {
    event.preventDefault()
    const { style } = event.target
    const relative_index = getDropPosition(event)
    if (relative_index === 1) {
      style.borderBottom = '2px solid #1890ff'
    } else if (relative_index === -1) {
      style.borderTop = '2px solid #1890ff'
    } else {
      style.background = '#1890ff'
    }
    this.drag_relative_index = relative_index
  }

  moveNode = event => {
    event.target.style = ''
    const drag_node_key = this.drag_node_key
    const drop_node_key = event.target.getAttribute('data-key')
    if (drag_node_key !== drop_node_key) {
      const drag_index_arr = drag_node_key.split('-').slice(1)
      const drop_index_arr = drop_node_key.split('-').slice(1)
      let drag_data

      const new_data = produce(this.state.data, draftState => {
        const drop_node_index = +drop_index_arr[drop_index_arr.length - 1]
        // 直接添加到最后的情况下
        let add_node_index = -1
        let add_target_index_arr = drop_index_arr
        // 指定位置的情况下
        if (this.drag_relative_index !== 0) {
          add_node_index = drop_node_index + Math.max(this.drag_relative_index, 0)
          // 同级向上拖的问题。先删掉会使计算的index多1
          if (drag_index_arr.slice(0, -1).join() === drop_index_arr.slice(0, -1).join()) {
            if (drag_index_arr[drag_index_arr.length - 1] < drop_index_arr[drop_index_arr.length - 1]) {
              add_node_index -= 1
            }
            // add_node_index = drop_node_index + Math.min(this.drag_relative_index, 0)
          }
          add_target_index_arr = drop_index_arr.slice(0, -1)
        }
        const add_target = getNodeByIndexArr(add_target_index_arr, draftState)
        // console.log(this.drag_relative_index, drop_index_arr, JSON.parse(JSON.stringify(add_target)), add_node_index)
        // console.log(drop_node_index, this.drag_relative_index, add_node_index)

        // 先删除
        // console.log(drag_index_arr)
        const delete_node_index = drag_index_arr.pop()
        const parent_data = getNodeByIndexArr(drag_index_arr, draftState)
        // console.log(drag_index_arr, JSON.parse(JSON.stringify(parent_data)), delete_node_index)
        // 如果不是根节点
        if (drag_index_arr.length > 0) {
          if (!Array.isArray(parent_data.children)) {
            parent_data.children = []
          }
          drag_data = parent_data.children.splice(delete_node_index, 1)[0]
        } else {
          drag_data = draftState.splice(delete_node_index, 1)[0]
        }
        // console.log(JSON.parse(JSON.stringify(add_target)))
        // 再添加
        if (Array.isArray(add_target)) {
          if (add_node_index === -1) {
            draftState.push(drag_data)
          } else {
            draftState.splice(add_node_index, 0, drag_data)
          }
        } else {
          if (!Array.isArray(add_target.children)) {
            add_target.children = []
          }
          if (add_node_index === -1) {
            add_target.children.push(drag_data)
          } else {
            add_target.children.splice(add_node_index, 0, drag_data)
          }
          add_target.state.isOpen = true
        }
      })
      this.setState({
        data: new_data
      })
    }
  }


  handleWrapClick = event => {
    closeMenu()
  }

  setCheckedState = (isChecked, data) => {
    data.state.isChecked = isChecked
    if (this.props.afterSelectNode === 'disabled') {
      data.state.isOpen = false
      data.state.isDisabled = isChecked
    }
  }

  setSameIdChecked = (isChecked, data, selected_ids) => {
    const attr = this.props.checkSameAttr
    if (data[attr] && selected_ids.has(data[attr])) {
      this.setCheckedState(isChecked, data)
    }
  }

  render() {
    const {
      data,
      selected,
      active_key,
      no_search_data,
      matched_keys,
    } = this.state
    const {
      hasOperate,
      hasCheckbox,
      isDraggable,
      nodeTypes,
    } = this.props
    return (
      <div className="tree-wrap" onClick={this.handleWrapClick}>
        {
          this.props.hasSearch &&
          <div className="search-group">
            <input className="search-input" type="text" onKeyUp={this.searchNode}/>
            {no_search_data && (this.props.noSearchData() || <p>没有匹配的对象</p>)}
          </div>
        }
        <ul onClick={(e) => hasOperate && this.toggleActive(e)}>
          <TreeNode data={data}
                    toggleNode={this.toggleNode}
                    checkNode={this.checkNode}
                    hasOperate={hasOperate}
                    hasCheckbox={hasCheckbox}
                    isDraggable={isDraggable}
                    dragStart={this.dragStart}
                    dragEnd={this.dragEnd}
                    dragEnter={this.dragEnter}
                    dragOver={this.dragOver}
                    moveNode={this.moveNode}
                    keyTextMap={this.keyTextMap}
                    matchedKeys={matched_keys}
                    nodeTypes={nodeTypes}
          />
        </ul>
        {
          this.props.afterSelectNode === 'disabled' &&
          <ul className="selected-result-list">selected result:
            {
              selected.map((o, i) =>
                <li className="result-node" key={o.key} onClick={() => this.unCheckNode(o.key, i)}>
                  {
                    this.props.resultNode(o) ||
                    <span>
                    {nodeTypes[o.type]}{o.name}
                      <b style={{float: 'right'}}>&times;</b>
                  </span>
                  }
                </li>
              )
            }
          </ul>
        }
        {
          this.props.hasOperate &&
          <ul className="operate-menu" onClick={e => e.stopPropagation()}>
            <li onClick={() => this.addNode(active_key)}>添加子节点</li>
            <li onClick={() => this.editNode(active_key)}>修改名称</li>
            <li onClick={() => this.deleteNode(active_key)}>删除</li>
          </ul>
        }
      </div>
    )
  }
}
