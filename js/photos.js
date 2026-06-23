// State to hold uploaded photos: array of { name: string, dataUrl: string }
let uploadedPhotos = [];
const MAX_PHOTOS = 3;

// Callback function to run whenever the photos list changes
let onChangeCallback = null;

export function getPhotos() {
  return uploadedPhotos;
}

export function clearPhotos() {
  uploadedPhotos = [];
  triggerChange();
}

export function onPhotosChange(callback) {
  onChangeCallback = callback;
}

function triggerChange() {
  if (typeof onChangeCallback === 'function') {
    onChangeCallback(uploadedPhotos);
  }
}

/**
 * Initialize photo upload components
 * @param {string} dropZoneId - ID of the drag & drop area
 * @param {string} fileInputId - ID of the hidden file input
 * @param {string} gridId - ID of the preview grid container
 * @param {string} badgeId - ID of the photo count badge
 */
export function initPhotoUpload(dropZoneId, fileInputId, gridId, badgeId) {
  const dropZone = document.getElementById(dropZoneId);
  const fileInput = document.getElementById(fileInputId);
  const grid = document.getElementById(gridId);
  const badge = document.getElementById(badgeId);

  if (!dropZone || !fileInput || !grid || !badge) {
    console.error('Photo upload elements not found');
    return;
  }

  // Click on drop zone triggers file input click
  dropZone.addEventListener('click', (e) => {
    // Avoid double trigger if clicking on elements inside
    if (e.target !== fileInput) {
      fileInput.click();
    }
  });

  // Keydown triggers file input for accessibility
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  // Drag & drop events
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }, false);

  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
    // Reset file input value to allow uploading same file again if deleted
    fileInput.value = '';
  });

  // Handle files
  function handleFiles(files) {
    const remainingSlots = MAX_PHOTOS - uploadedPhotos.length;
    if (remainingSlots <= 0) {
      return; // Silently ignore
    }

    const filesArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (filesArray.length === 0) {
      return; // Silently ignore
    }

    const filesToUpload = filesArray.slice(0, remainingSlots);

    let filesRead = 0;
    filesToUpload.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedPhotos.push({
          name: file.name,
          dataUrl: e.target.result
        });
        filesRead++;
        if (filesRead === filesToUpload.length) {
          triggerChange();
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Listen for changes to redraw the UI
  onPhotosChange((photos) => {
    // Update badge text
    badge.textContent = `${photos.length}/${MAX_PHOTOS} gambar`;

    // Redraw grid
    grid.innerHTML = '';
    photos.forEach((photo, index) => {
      const container = document.createElement('div');
      container.className = 'photo-thumb-container';

      const img = document.createElement('img');
      img.className = 'photo-thumb';
      img.src = photo.dataUrl;
      img.alt = photo.name;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'photo-delete-btn';
      deleteBtn.type = 'button';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.setAttribute('aria-label', `Buang gambar ${photo.name}`);
      
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering dropzone click
        uploadedPhotos.splice(index, 1);
        triggerChange();
      });

      container.appendChild(img);
      container.appendChild(deleteBtn);
      grid.appendChild(container);
    });
  });

  // Initial render trigger
  triggerChange();
}
