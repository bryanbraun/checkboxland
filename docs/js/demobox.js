function init() {
  const iFrameEl = document.querySelector('#demobox iframe');

  document.forms.demoboxForm.addEventListener('change', function handleDemoChange(e) {
    if (e.target.name === 'demoRadios') {
      const newIframeSrc = `docs/demos/${e.target.value}/index.html`;

      iFrameEl.src = newIframeSrc;
    }
  });
}

export const demobox = {
  init
};
