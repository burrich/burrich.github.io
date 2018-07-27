/**
 * NodeList forEach polyfill for ie.
 * see https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
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
 * Wait for ressources loading and :
 * - update active menu item after checking the current hash section
 * - listen for updates on scroll
 * 
 * nb : images must be loaded (load event) to manage scroll events/properties.
 */
window.addEventListener('load', () => {
  const body         = document.body;
  const scrollTopMax = body.scrollHeight - body.clientHeight;
  
  // Article and about sections top values are rounded (Math.floor) 
  // in order to match window.scrollY (integer).

  const articles     = document.querySelector('#articles');
  const articlesTop  = Math.floor(articles.getBoundingClientRect().top + window.scrollY);
  
  const about        = document.querySelector('#about');
  const aboutTop     = Math.floor(about.getBoundingClientRect().top + window.scrollY);
  
  const menuItems = document.querySelectorAll('.menu-list-item');

  let section = ''; 
  let menuActiveIndex = -1;

  checkHashSections();
  window.addEventListener('scroll', checkHashSections);
  
  /**
   * Check current hash section and update menu active item if necessary.
   */
  function checkHashSections() {
    if (window.scrollY >= aboutTop || window.scrollY === scrollTopMax) { 
        // about section
        if (section !== 'about') {
          section = 'about';
          updateMenu(2);
        }
    } else if (window.scrollY >= articlesTop) { 
      // articles section
      if (section !== 'articles') {
        section = 'articles';
        updateMenu(1);
      }
    } else {
       // home section
      if (section !== 'home') {
        section = 'home';
        updateMenu(0);
      }
    }
  }
  
  /**
   * Remove current active menu item class and add new.
   */
  function updateMenu(index) {
    if (menuActiveIndex !== -1) {
      menuItems[menuActiveIndex].classList.remove('active');
    }
    menuActiveIndex = index;
  
    menuItems[index].classList.add('active');
  }
});
