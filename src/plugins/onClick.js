let handleFun = null;
let displayEl = null;

function onClick(callback) {
  displayEl = this.displayEl;
  handleFun = handleEvent.bind(this, callback);
  displayEl.addEventListener('click', handleFun);
}

function handleEvent(callback, event) {
  const coords = findCoodrs(displayEl, event.target);
  if (!coords) {
    return;
  }

  const result = {
    x: coords.x,
    y: coords.y,
    checkbox: event.target,
  }
  
  if (typeof callback == 'function') {
    callback(result);
  } else if ('handleEvent' in callback && typeof callback.handleEvent == 'function') {
    callback.handleEvent(result);
  } else {
    throw new TypeError('Callback should be a function or an EventListener object');
  }
}

function findCoodrs(root, target) {
  for (let y = 0; y < root.children.length; y += 1) {
    const div = root.children[y];
    for (let x = 0; x < div.children.length; x += 1) {
      const checkbox = div.children[x];
      if (checkbox === target) {
        return { x, y };
      }
    }
  }
  return null;
}

function cleanUp() {
  displayEl.removeEventListener('click', handleFun);
}

export default {
  name: 'onClick',
  exec: onClick,
  cleanUp: cleanUp,
}
