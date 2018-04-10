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

var menuListItems = document.querySelectorAll('.menu-list-item');
var menuEntries = ['home', 'articles', 'about'];

var activeItemIndex = 0;

init();

/**
 * Init function :
 * - Add default active class to menu
 * - Add listeners
 */
function init() {
  var _this = this;

  // Update active item if url hash
  var urlHash = location.hash.substring(1);
  if (urlHash && urlHash !== 'home') {
    activeItemIndex = menuEntries.indexOf(urlHash);
  }

  addDefaultActiveClass(activeItemIndex);

  // Menu items listeners
  menuListItems.forEach(function (item, index) {
    item.onclick = updateActiveMenuItem.bind(_this, item, index);
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