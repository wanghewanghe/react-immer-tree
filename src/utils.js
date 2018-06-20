import produce from 'immer'

export const closeMenu = () => {
  const $openMenu = document.querySelector('.operate-menu.open')
  if ($openMenu) {
    $openMenu.classList.remove('open')
  }
}

export const recursiveTreeData = data => func => {
  data.forEach(o => {
    func(o)
    if (Array.isArray(o.children) && o.children.length > 0) {
      recursiveTreeData(o.children)(func)
    }
  })
}

export const getNodeByIndexArr = (index_arr, data) => index_arr.reduce((result, i, idx) => idx === index_arr.length - 1 ? result[i] : result[i].children, data)

export const produceNewData = (key, prevData, func) => produce(prevData, draftState =>
  func(getNodeByIndexArr(key.split('-').slice(1), draftState))
)
