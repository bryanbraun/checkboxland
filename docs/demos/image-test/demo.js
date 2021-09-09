import { Checkboxland } from '../../../src/index.js';

const selector = '#checkboxland';
const checkboxDisplayWidth = 40;
const checkboxDisplayHeight = 40;
const dimensions = `${checkboxDisplayWidth}x${checkboxDisplayHeight}`;
const fillValue = 0;

const cbl = new Checkboxland({ selector, dimensions, fillValue });

// SETUP FILE READER (used for upload and dropzone approaches)
const reader = new FileReader;
reader.addEventListener('load', e => cbl.renderImage(e.target.result));
reader.addEventListener('error', () => console.error(reader.error));

// SETUP FOR FILE UPLOADING
const fileInputEl = document.querySelector('input[type="file"]');
fileInputEl.addEventListener('change', handleFileSelection);

function handleFileSelection(e) {
  const selectedFile = e.target.files[0];

  if (selectedFile) {
    reader.readAsDataURL(selectedFile);
  }
}

// SETUP FOR URL LOADING
const formEl = document.getElementById('url-form');
formEl.addEventListener('submit', event => {
  event.preventDefault();
  cbl.renderImage(event.target.url.value);
})

// SETUP FOR DRAG AND DROP
const dropzoneEl = document.getElementById('dropzone');
dropzoneEl.addEventListener('dragover', preventDefaultDragAndDrop);
dropzoneEl.addEventListener('dragenter', preventDefaultDragAndDrop);
dropzoneEl.addEventListener('drop', e => {
  preventDefaultDragAndDrop(e);
  const dt = e.dataTransfer;
  const selectedFile = dt.files[0];
  if (selectedFile) {
    reader.readAsDataURL(selectedFile);
  }
});
function preventDefaultDragAndDrop(e) {
  e.stopPropagation();
  e.preventDefault();
}

// SETUP FOR PASSING AN IMAGE ELEMENT
const imageEl = document.getElementById('image');
cbl.renderImage(imageEl);


// SETUP FOR ANIMATED GIF?
