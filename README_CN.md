# react-immer-tree
***
易配置、可定制、可勾选、可拖拽的React树组件
***

### 功能
1. 支持勾选
    * 单选
    * 多选
    * 全选
    * 选中后禁用并收起
    * 勾选相同属性的节点
2. 支持拖拽
3. 节点下添加子节点
4. 修改节点名称
5. 删除节点
6. 支持搜索
7. 支持定制不同类型节点的icon

### 快速上手
1. ```npm install react-immer-tree```  
2. ```
    import React from 'react'
    import ReactDOM from 'react-dom'
    import Tree from 'react-immer-tree'
    import 'react-immer-tree/build/Tree.css'
    
    const data = [{
        name: 'a',
        children: [
            { name: 'b' }
            { name: 'c' }
            { name: 'd', children: [
                { name: 'e' }            
                { name: 'f' }            
            ]}
        ]
    }]
    
    ReactDOM.render(
      <div>
        <Tree data={data} />
      </div>,
      document.getElementById('app'))
   ```

### 更多可能
##### Tree Props
|参数            | 说明             | 类型    | 默认值 |
|----------------|------------------|---------|-------|
|afterSelectNode | 选中节点之后的效果<ul><li>disabled：禁用(如果有子节点则同时收起)</li><li>all：如果有子节点则全选</li><li>one：只选中自身</li></ul>| string | 'disabled'|
|beforeAdd       |菜单中添加子节点添加前的回调，需要返回true，否则不会添加|function|`() => true`|
|beforeDelete    |菜单中删除节点前的回调，需要返回true，否则不会删除|function|`() => true`|
|beforeEdit      |菜单中修改名称前的回调，需要返回true，否则不会编辑|function|`() => true`|
|checkSameAttr   | 勾选有相同属性（例如id）的节点| string | '' |
|data            | 树结构的数据      | array   | []    |
|hasOperate      | 是否有操作菜单    | boolean | false |
|hasCheckbox     | 是否有勾选框      | boolean | false |
|hasSearch       | 是否有搜索功能    | boolean | false |
|isRadio         |  是否单选        | boolean | false |
|isDraggable     |  是否拖拽        | boolean | false |
|nodeTypes       |不同type的节点对应的显示（可以根据data中的type字段，给不同type的node配置icon）|object{typename: reactElement} | {} |
|noSearchData    |搜索不到数据时显示的内容（返回值reactElement）| function | () => {} | 
|onAdd           |菜单中添加子节点(返回值为子节点信息{name: xxx, state: xxx})|function | () => ({})|
|onChecked       |选中后的回调        |function(selected[]) | () => {} |
|onEdit          |菜单中修改名称，返回值为编辑的节点名字 | function | () => 'edited name'|
|onUnchecked     |取消选中后的回调     |function(selected[]) | () => {} |
|resultNode      |返回值reactElement，展示在勾选结果列表中。（afterSelectNode为disabled时会显示结果列表）| function | () => {}|
 
##### Node JSON Data
```
[
    {
        name: xxx,          // 节点名字（string／reactElement）
        type: xxx,          // 节点type（string／number），配合nodeTypes这个props，来设置不同type节点的展示
        state: {            // 节点state
            isOpen: false,  // 是否展开
            isChecked: false,  // 是否选中
            isDisabled: false, // 是否禁用
        },
        children: [{}, {}]  // 子节点
    }
]
```
