export const closeMenu = () => {
  const $openMenu = document.querySelector('.operate-menu.open')
  if ($openMenu) {
    $openMenu.classList.remove('open')
  }
}
