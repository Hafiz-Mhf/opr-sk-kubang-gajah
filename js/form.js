import { initPhotoUpload, getPhotos, clearPhotos } from './photos.js';
import { renderOPRHtml } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. State Management
  let currentStep = 1;
  const totalSteps = 3;

  // 2. DOM Elements
  const formWrapper = document.getElementById('form-wrapper');
  const previewWrapper = document.getElementById('preview-wrapper');
  const oprContent = document.getElementById('opr-content');

  // Step containers
  const stepContainers = {
    1: document.getElementById('step-1-container'),
    2: document.getElementById('step-2-container'),
    3: document.getElementById('step-3-container')
  };

  // Step indicators
  const stepIndicators = {
    1: document.getElementById('step-indicator-1'),
    2: document.getElementById('step-indicator-2'),
    3: document.getElementById('step-indicator-3')
  };

  const stepPills = {
    1: stepIndicators[1].querySelector('.step-pill'),
    2: stepIndicators[2].querySelector('.step-pill'),
    3: stepIndicators[3].querySelector('.step-pill')
  };

  const progressLine = document.getElementById('progress-line');

  // Control Buttons
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');

  // Preview Action Buttons
  const editBackBtn = document.getElementById('edit-back-btn');
  const printPdfBtn = document.getElementById('print-pdf-btn');

  // Input Elements
  const fields = {
    // Step 1
    namaAktiviti: document.getElementById('nama-aktiviti'),
    tarikh: document.getElementById('tarikh-aktiviti'),
    tempat: document.getElementById('tempat-aktiviti'),
    penyelaras: document.getElementById('penyelaras'),
    sasaran: document.getElementById('sasaran'),
    masaMula: document.getElementById('masa-mula'),
    masaTamat: document.getElementById('masa-tamat'),
    tempohAktiviti: document.getElementById('tempoh-aktiviti'),
    // Step 2
    objektif: document.getElementById('objektif'),
    hasil: document.getElementById('hasil'),
    cabaran: document.getElementById('cabaran')
  };

  // Real-time calculated duration and validation helper
  function updateCalculatedDuration() {
    const masaMula = fields.masaMula.value;
    const masaTamat = fields.masaTamat.value;

    if (!masaMula || !masaTamat) {
      fields.tempohAktiviti.value = '';
      clearError(fields.masaMula);
      return;
    }

    const [startH, startM] = masaMula.split(':').map(Number);
    const [endH, endM] = masaTamat.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    const diff = endTotal - startTotal;

    if (diff < 0) {
      showError(fields.masaMula, 'Masa tamat tidak boleh lebih awal daripada masa mula.');
      fields.tempohAktiviti.value = '';
    } else {
      clearError(fields.masaMula);
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;

      let durationText = '';
      if (hours > 0 && minutes > 0) {
        durationText = `${hours} jam ${minutes} minit`;
      } else if (hours > 0) {
        durationText = `${hours} jam`;
      } else {
        durationText = `${minutes} minit`;
      }
      fields.tempohAktiviti.value = durationText;
    }
  }

  if (fields.masaMula && fields.masaTamat) {
    fields.masaMula.addEventListener('input', updateCalculatedDuration);
    fields.masaMula.addEventListener('change', updateCalculatedDuration);
    fields.masaTamat.addEventListener('input', updateCalculatedDuration);
    fields.masaTamat.addEventListener('change', updateCalculatedDuration);
  }

  // 3. Setup Character Countdown Counters
  function setupCharCounter(textareaId, counterId, limit) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    if (!textarea || !counter) return;

    function updateCount() {
      const length = textarea.value.length;
      counter.textContent = `${length} / ${limit} aksara`;
      if (length >= limit) {
        counter.classList.add('limit-reached');
      } else {
        counter.classList.remove('limit-reached');
      }
    }

    textarea.addEventListener('input', updateCount);
    textarea.addEventListener('change', updateCount);
    updateCount();
  }

  setupCharCounter('objektif', 'objektif-count', 450);
  setupCharCounter('hasil', 'hasil-count', 450);

  // 4. Initialize Photo Upload Manager
  initPhotoUpload(
    'upload-zone',
    'photo-input',
    'photos-preview-grid',
    'photo-count-badge'
  );

  // 4. Stepper Navigation Functions
  function updateStepperUI() {
    // Update active container
    for (let step = 1; step <= totalSteps; step++) {
      if (step === currentStep) {
        stepContainers[step].classList.remove('hidden');
      } else {
        stepContainers[step].classList.add('hidden');
      }
    }

    // Update indicator states (active, done, future)
    for (let step = 1; step <= totalSteps; step++) {
      const indicator = stepIndicators[step];
      const pill = stepPills[step];

      if (step < currentStep) {
        indicator.className = 'step-indicator done';
        pill.innerHTML = '&#10003;'; // Checkmark symbol
      } else if (step === currentStep) {
        indicator.className = 'step-indicator active';
        pill.innerHTML = step;
      } else {
        indicator.className = 'step-indicator future';
        pill.innerHTML = step;
      }
    }

    // Update progress connection bar length
    const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = `${percent}%`;

    // Button states
    if (currentStep === 1) {
      prevBtn.disabled = true;
      prevBtn.classList.add('hidden');
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    } else if (currentStep === totalSteps) {
      prevBtn.disabled = false;
      prevBtn.classList.remove('hidden');
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
    } else {
      prevBtn.disabled = false;
      prevBtn.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    }
  }

  // 5. Validation Helpers
  function showError(inputEl, message) {
    const group = inputEl.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      const errText = group.querySelector('.error-text');
      if (errText) {
        errText.textContent = message;
      }
    }
  }

  function clearError(inputEl) {
    const group = inputEl.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
  }

  // Auto-clear errors on input
  Object.values(fields).forEach(inputEl => {
    if (inputEl) {
      inputEl.addEventListener('input', () => clearError(inputEl));
      inputEl.addEventListener('change', () => clearError(inputEl));
    }
  });

  function validateStep(step) {
    let isValid = true;

    if (step === 1) {
      // Validate Step 1 inputs
      if (!fields.namaAktiviti.value.trim()) {
        showError(fields.namaAktiviti, 'Sila masukkan nama aktiviti.');
        isValid = false;
      }
      if (!fields.tarikh.value) {
        showError(fields.tarikh, 'Sila pilih tarikh aktiviti.');
        isValid = false;
      }
      if (!fields.tempat.value.trim()) {
        showError(fields.tempat, 'Sila masukkan tempat/lokasi aktiviti.');
        isValid = false;
      }
      if (!fields.penyelaras.value.trim()) {
        showError(fields.penyelaras, 'Sila masukkan nama penyampai program.');
        isValid = false;
      }
      if (!fields.sasaran.value) {
        showError(fields.sasaran, 'Sila pilih sasaran aktiviti.');
        isValid = false;
      }
      if (!fields.masaMula.value) {
        showError(fields.masaMula, 'Sila masukkan masa mula.');
        isValid = false;
      } else if (!fields.masaTamat.value) {
        showError(fields.masaMula, 'Sila masukkan masa tamat.');
        isValid = false;
      } else {
        const [startH, startM] = fields.masaMula.value.split(':').map(Number);
        const [endH, endM] = fields.masaTamat.value.split(':').map(Number);
        if (endH * 60 + endM < startH * 60 + startM) {
          showError(fields.masaMula, 'Masa tamat tidak boleh lebih awal daripada masa mula.');
          isValid = false;
        }
      }
    } else if (step === 2) {
      // Validate Step 2 textareas
      if (!fields.objektif.value.trim()) {
        showError(fields.objektif, 'Sila nyatakan objektif aktiviti.');
        isValid = false;
      }
      if (!fields.hasil.value.trim()) {
        showError(fields.hasil, 'Sila nyatakan impak aktiviti.');
        isValid = false;
      }
    }

    return isValid;
  }

  // 6. Navigation Button Click Handlers
  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepperUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Focus on the first element with an error
      const firstError = document.querySelector('.form-group.has-error input, .form-group.has-error textarea');
      if (firstError) {
        firstError.focus();
      }
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepperUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // 7. Report Compilation & Switch to Preview Mode
  submitBtn.addEventListener('click', () => {
    // Read and format Tempoh Masa Aktiviti
    const masaMula = fields.masaMula ? fields.masaMula.value : '';
    const masaTamat = fields.masaTamat ? fields.masaTamat.value : '';

    function formatMasa(t) {
      if (!t) return '—';
      const [h, m] = t.split(':').map(Number);
      const suffix = h < 12 ? 'pagi' : h < 15 ? 'tengah hari' : h < 19 ? 'petang' : 'malam';
      const hour = h % 12 || 12;
      return `${hour}:${String(m).padStart(2,'0')} ${suffix}`;
    }

    let calculatedDuration = '';
    if (masaMula && masaTamat) {
      const [startH, startM] = masaMula.split(':').map(Number);
      const [endH, endM] = masaTamat.split(':').map(Number);
      const diff = (endH * 60 + endM) - (startH * 60 + startM);
      if (diff >= 0) {
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        if (hours > 0 && minutes > 0) {
          calculatedDuration = ` (${hours} jam ${minutes} minit)`;
        } else if (hours > 0) {
          calculatedDuration = ` (${hours} jam)`;
        } else {
          calculatedDuration = ` (${minutes} minit)`;
        }
      }
    }

    const tempohMasa = masaMula && masaTamat
      ? `${formatMasa(masaMula)} – ${formatMasa(masaTamat)}${calculatedDuration}`
      : '—';

    const statusVal = document.getElementById('status-aktiviti') ? document.getElementById('status-aktiviti').value : 'Berjaya Dilaksanakan';
    const catatanVal = document.getElementById('catatan') ? document.getElementById('catatan').value : '';

    // Collect all data
    const data = {
      namaAktiviti: fields.namaAktiviti.value,
      tarikh: fields.tarikh.value,
      tempat: fields.tempat.value,
      penyelaras: fields.penyelaras.value,
      sasaran: fields.sasaran.value,
      objektif: fields.objektif.value,
      hasil: fields.hasil.value,
      cabaran: fields.cabaran.value,
      tempohMasa: tempohMasa,
      status: statusVal,
      catatan: catatanVal
    };

    const photos = getPhotos();

    // Render OPR and inject into DOM
    const htmlOutput = renderOPRHtml(data, photos);
    oprContent.innerHTML = htmlOutput;

    // Adapt photo grid layout based on image orientations
    requestAnimationFrame(() => {
      const imgs = [...oprContent.querySelectorAll('.opr-photo-img')];
      if (!imgs.length) return;

      let pending = imgs.length;
      let portraitCount = 0;
      const photosGrid = oprContent.querySelector('.opr-photos');

      const finalize = () => {
        if (!photosGrid) return;
        if (portraitCount === imgs.length) {
          // All portrait: restructure grid cells to portrait-proportioned shape
          photosGrid.classList.add('all-portrait');
        } else if (portraitCount > 0) {
          // Mixed: contain only portrait images to avoid severe cropping
          imgs.forEach(img => {
            if (img.naturalHeight > img.naturalWidth) img.classList.add('portrait');
          });
        }
      };

      imgs.forEach(img => {
        const check = () => {
          if (img.naturalHeight > img.naturalWidth) portraitCount++;
          if (--pending === 0) finalize();
        };
        if (img.complete && img.naturalHeight > 0) {
          check();
        } else {
          img.addEventListener('load', check, { once: true });
        }
      });
    });

    // View toggle - add preview studio styles to container
    const appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.classList.add('preview-mode');

    formWrapper.classList.add('hidden');
    previewWrapper.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 8. Preview Actions click handlers
  editBackBtn.addEventListener('click', () => {
    // Go back to step 3 in form - remove preview studio styles
    const appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.classList.remove('preview-mode');

    previewWrapper.classList.add('hidden');
    formWrapper.classList.remove('hidden');
    currentStep = 3;
    updateStepperUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  printPdfBtn.addEventListener('click', () => {
    window.print();
  });

  // Initialize view
  updateStepperUI();
});
