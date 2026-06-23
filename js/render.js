import { LOGO_B64 } from '../assets/logo-b64.js';

/**
 * Escapes unsafe characters to prevent XSS
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats YYYY-MM-DD date to DD/MM/YYYY or readable Malay format
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  
  // Array of Malay month names
  const bulan = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ];
  
  const monthIdx = parseInt(month, 10) - 1;
  if (monthIdx >= 0 && monthIdx < 12) {
    return `${parseInt(day, 10)} ${bulan[monthIdx]} ${year}`;
  }
  
  return `${day}/${month}/${year}`;
}

/**
 * Maps program status to standard design type
 * @param {string} status 
 * @returns {string}
 */
function getBadgeType(status) {
  switch (status) {
    case 'Selesai':
    case 'Berjaya Dilaksanakan':
      return 'success';
    case 'Dalam Proses':
      return 'warning';
    case 'Ditangguhkan':
      return 'danger';
    default:
      return 'neutral';
  }
}

/**
 * Generates narrative summary from existing report statistics
 * @param {Object} data 
 * @returns {string}
 */
function generateRingkasan(data) {
  const formattedDate = formatDate(data.tarikh) || 'tarikh yang ditetapkan';
  const tempatStr = data.tempat ? ` di ${data.tempat}` : '';
  const penyelarasStr = data.penyelaras ? ` oleh ${data.penyelaras}` : '';
  
  let sasaranStr = '';
  if (data.sasaran) {
    const sasaranLower = data.sasaran.toLowerCase();
    sasaranStr = ` Program ini melibatkan ${sasaranLower}.`;
  }
  
  return `Program "${escapeHTML(data.namaAktiviti)}" telah berjaya dilaksanakan pada ${formattedDate}${tempatStr}${penyelarasStr}.${sasaranStr} Secara keseluruhannya, aktiviti ini berjalan dengan lancar mengikut perancangan dan mencapai objektif yang telah ditetapkan.`;
}

/**
 * Returns default caption based on image order index
 * @param {number} index 
 * @returns {string}
 */
function getDefaultCaption(index) {
  switch (index) {
    case 0:
      return 'Sesi taklimat dan pengenalan program.';
    case 1:
      return 'Aktiviti utama dan penglibatan aktif peserta semasa program.';
    case 2:
      return 'Sesi bergambar kenang-kenangan bersama para peserta dan penyampai.';
    default:
      return 'Aktiviti program.';
  }
}

/**
 * Generates the OPR document body HTML
 * @param {Object} data - Form data
 * @param {Array} photos - Uploaded photos array of { name, dataUrl }
 * @returns {string}
 */
export function renderOPRHtml(data, photos) {
  // Logo output logic
  let logoHtml = '<div class="opr-logo-fallback">SKKG</div>';
  if (LOGO_B64 && LOGO_B64.trim() !== '') {
    logoHtml = `<img class="opr-logo" src="${LOGO_B64}" alt="Logo SK Kubang Gajah">`;
  }

  const objektifHtml = `
    <div class="opr-section">
      <div class="opr-section-head">🎯 Objektif</div>
      <div class="opr-section-body">${escapeHTML(data.objektif)}</div>
    </div>
  `;

  const hasilHtml = `
    <div class="opr-section opr-section-hasil">
      <div class="opr-section-head">✅ Impak</div>
      <div class="opr-section-body opr-section-body-hasil">${escapeHTML(data.hasil)}</div>
    </div>
  `;

  // Render photo gallery - dynamic column layout with optional user captions
  let galleryHtml = '';
  if (photos && photos.length > 0) {
    const imagesMarkup = photos
      .map((p, index) => `
        <div class="opr-photo-container">
          <img class="opr-photo-img" src="${p.dataUrl}" alt="${escapeHTML(p.name)}">
          <div class="opr-photo-caption" contenteditable="true" title="Klik untuk edit kapsyen" data-placeholder="Klik untuk edit kapsyen">${escapeHTML(p.caption || '')}</div>
        </div>
      `)
      .join('');
    galleryHtml = `
      <div class="opr-section opr-section-photos">
        <div class="opr-section-head">📸 Bukti Pelaksanaan</div>
        <div class="opr-photos opr-photos-count-${photos.length}">${imagesMarkup}</div>
      </div>
    `;
  }

  // Notes omitted from A4 printable structure to optimize space

  // Return the main wrapper structure
  return `
    <div class="opr-paper opr-sheet">
      <!-- School Header Bar -->
      <header class="opr-header">
        <div class="opr-header-left">
          ${logoHtml}
        </div>
        <div class="opr-header-center">
          <div class="opr-school-name">SEKOLAH KEBANGSAAN KUBANG GAJAH</div>
          <div class="opr-school-sub">Arau, Perlis</div>
          <div class="opr-school-label">LAPORAN PELAKSANAAN AKTIVITI (OPR)</div>
        </div>
        <div class="opr-header-right">
          <div class="opr-date">${formatDate(data.tarikh)}</div>
        </div>
      </header>

      <div class="opr-body">
        <!-- Title and Badge -->
        <div class="opr-title-container">
          <h2 class="opr-title">${escapeHTML(data.namaAktiviti)}</h2>
          <span class="opr-badge opr-badge-${getBadgeType(data.status)}">${escapeHTML(data.status).toUpperCase()}</span>
        </div>

        <!-- Program Summary Card -->
        <div class="opr-summary-card">
          <div class="opr-summary-item">
            <span class="opr-summary-icon">📅</span>
            <div class="opr-summary-details">
              <span class="opr-summary-label">Tarikh</span>
              <span class="opr-summary-value">${formatDate(data.tarikh)}</span>
            </div>
          </div>
          <div class="opr-summary-item">
            <span class="opr-summary-icon">📍</span>
            <div class="opr-summary-details">
              <span class="opr-summary-label">Lokasi</span>
              <span class="opr-summary-value">${escapeHTML(data.tempat)}</span>
            </div>
          </div>
          <div class="opr-summary-item">
            <span class="opr-summary-icon">⏰</span>
            <div class="opr-summary-details">
              <span class="opr-summary-label">Tempoh Aktiviti</span>
              <span class="opr-summary-value">${escapeHTML(data.tempohMasa || '—')}</span>
            </div>
          </div>
          <div class="opr-summary-item">
            <span class="opr-summary-icon">👨‍🏫</span>
            <div class="opr-summary-details">
              <span class="opr-summary-label">Penyampai</span>
              <span class="opr-summary-value">${escapeHTML(data.penyelaras)}</span>
            </div>
          </div>
          <div class="opr-summary-item">
            <span class="opr-summary-icon">👥</span>
            <div class="opr-summary-details">
              <span class="opr-summary-label">Sasaran</span>
              <span class="opr-summary-value">${escapeHTML(data.sasaran || '—')}</span>
            </div>
          </div>
        </div>

        <!-- Ringkasan Aktiviti -->
        <div class="opr-section">
          <div class="opr-section-head">📌 Ringkasan Aktiviti</div>
          <div class="opr-section-body">${generateRingkasan(data)}</div>
        </div>

        <!-- Sections content -->
        <div class="opr-dashboard-grid">
          ${objektifHtml}
          ${hasilHtml}
        </div>

        <!-- Photo Gallery -->
        ${galleryHtml}

        <!-- Audit Footer -->
        <div class="opr-timestamp">
          <span>Dijana oleh Sistem OPR SKKG</span>
          <span>Tarikh Cetakan: ${new Date().toLocaleDateString('ms-MY', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}</span>
          <span>Versi Dokumen: 1.2</span>
        </div>
      </div>
    </div>
  `;
}
