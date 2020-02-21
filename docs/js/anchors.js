// In the future, we'll import anchorJS, but for now, we'll rely
// on the object the script tag added to the DOM.

function init() {
  window.anchors.add('main h2:not(.subtitle),main h3,main h4,main h5,main h6');
}

export const anchors = {
  init
};
