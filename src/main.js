'use strict';

/**
 * NodeList forEach polyfill for ie.
 * TODO: remove this when core-js v3 (babel dependencie) will be available
 */
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
          callback.call(thisArg, this[i], i, this);
      }
  };
}

const menuListItems = document.querySelectorAll('.menu-list-item');
const menuEntries = ['home', 'articles', 'about'];

let activeItemIndex = 0;

init();

/**
 * Init function :
 * - Add default active class to menu
 * - Add listeners
 */
function init() {
  // Update active item if url hash
  const urlHash = location.hash.substring(1);
  if (urlHash && urlHash !== 'home') {
    activeItemIndex = menuEntries.indexOf(urlHash);
  } 

  addDefaultActiveClass(activeItemIndex);

  // Menu items listeners
  menuListItems.forEach((item, index) => {
    item.onclick = updateActiveMenuItem.bind(this, item, index);
  });
}

/**
 * Add default active class to menu.
 */
function addDefaultActiveClass(activeItemIndex) {
  menuListItems[activeItemIndex].classList.add('active');
}

/**
 * Remove current active item class and add new
 * if item clicked is not the current active item.
 */
function updateActiveMenuItem(item, index, e) {
  if (index === activeItemIndex) {
    return;
  }

  menuListItems[activeItemIndex].classList.remove('active');
  activeItemIndex = index;

  item.classList.add('active');
}