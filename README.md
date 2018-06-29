# react-immer-tree
***
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wanghewanghe/react-immer-tree/blob/master/LICENSE)
![Scrutinizer Build](https://img.shields.io/scrutinizer/build/g/filp/whoops.svg)

Easy to configure, customisable React tree component. Support drag and drop, check, search, etc.

[中文README](https://github.com/wanghewanghe/react-immer-tree/blob/master/README_CN.md)
***

### Feature
1. check
    * check only one node
    * check multiple node
    * check all node
    * disabled and close node after checked
    * check nodes which have same attribute
2. drag and drop
3. append new node
4. edit node name
5. delete node
6. search node by name
7. set different icon or other element on different node type

### Usage
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

### API
##### Tree Props
|props           | description      | type    | default |
|----------------|------------------|---------|-------|
|afterSelectNode | effects after check node<ul><li>disabled：disabled node and close node</li><li>all：check all children nodes</li><li>one：only check itself</li></ul>| string | 'disabled'|
|beforeAdd       |callback function before append child node in menu，need to return true，otherwise append action will fail|function|`() => true`|
|beforeDelete    |callback function before delete node in menu，need to return true，otherwise delete acton will fail|function|`() => true`|
|beforeEdit      |callback function before edit node name in menu，need to return true，otherwise edit action will fail|function|`() => true`|
|checkSameAttr   | check nodes which have same attribute(such as 'id')| string | '' |
|data            | tree structure data | array   | []    |
|hasOperate      | has operate menu or not | boolean | false |
|hasCheckbox     | has checkbox or not     | boolean | false |
|hasSearch       | has search ability or not | boolean | false |
|isRadio         | is check only one or not  | boolean | false |
|isDraggable     | is draggable or not       | boolean | false |
|nodeTypes       | type(set in node data)-element object (maybe you can use it to set different node type with different icon)|object{typename: reactElement} | {} |
|noSearchData    |return reactElement which will show when no data matched| function | () => {} | 
|onAdd           |callback function when append child node, return child node data -- {name: xxx, state: xxx}|function | () => ({})|
|onChecked       |callback function after check node   |function(selected[]) | () => {} |
|onEdit          |callback function when edit node name, return edit name | function | () => 'edited name'|
|onUnchecked     |callback function after uncheck node   |function(selected[]) | () => {} |
|resultNode      |return reactElement，which will show in check result list. (check result list will show when afterSelectNode set 'disabled') | function | () => {}|
 
##### Node JSON Data
```
[
    {
        name: xxx,          // node name(string／reactElement)
        type: xxx,          // node type(string／number)
        state: {            // node state
            isOpen: false,  // open or not
            isChecked: false, // check or not
            isDisabled: false, // disable or not
        },
        children: [{}, {}]
    }
]
```
