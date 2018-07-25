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

/**
 * Wait for DOM loading.
 */
if (document.readyState !== 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function onDocumentReady() {
  // console.log('document.readyState', document.readyState);
  
  const menuListItems = document.querySelectorAll('.menu-list-item');
  
  const menuEntries = ['home', 'articles', 'about'];
  let section = menuEntries[0];

  let activeItemIndex = 0;
  
  init();
  setupScrollEvent();
  
  function setupScrollEvent() {
    const contentContainer = document.querySelector('.content-container');
    const scrollTopMax     = contentContainer.scrollHeight - contentContainer.clientHeight;
    const articles         = document.querySelector('#articles');
    const articlesTop      = articles.getBoundingClientRect().top + window.scrollY;
    const about            = document.querySelector('#about');
    const aboutTop         = about.getBoundingClientRect().top + window.scrollY;
    
    // const menuEntries = ['home', 'articles', 'about'];
    // let section = menuEntries[0];

    console.log('Before addEvent');
    window.addEventListener('scroll', (e) => {
      console.log('scroll', window.scrollY);
      // console.log('articlesBox.top + window.scrollY', articlesBox.top + window.scrollY);
  
      if (window.scrollY >= Math.floor(aboutTop) ||
        window.scrollY === scrollTopMax) { // about
          // console.log('if');
          if (section !== 'about') {
            section = menuEntries[2];
            updateActiveMenuItem(menuListItems[2], 2);
          }
      } else if (window.scrollY >= Math.floor(articlesTop)) { // articles
        // console.log('else if');
        if (section !== 'articles') {
          section = menuEntries[1];
          updateActiveMenuItem(menuListItems[1], 1);
        }
      } else { // home
        // console.log('else');
        if (section !== 'home') {
          section = menuEntries[0];
          updateActiveMenuItem(menuListItems[0], 0);
        }
      }
    });
  }
  
  /**
   * Init function :
   * - Add default active class to menu
   */
  function init() {
    const urlHash = location.hash.substring(1); // TODO: rename
 
    const articles         = document.querySelector('#articles');
    const articlesTop      = articles.getBoundingClientRect().top + window.scrollY;

    if (!urlHash || (urlHash === 'home')) {
      addDefaultActiveClass(activeItemIndex);
    }
    if (urlHash && (urlHash === 'articles')) {
      // section = menuEntries[1];
      // window.scroll(0, 0);
    }
    if (urlHash && (urlHash === 'about')) {
    }
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
  function updateActiveMenuItem(item, index) {
    if (index === activeItemIndex) { // useless ? (no jump ?)
      return;
    }
  
    menuListItems[activeItemIndex].classList.remove('active');
    activeItemIndex = index;
  
    item.classList.add('active');
  }
}