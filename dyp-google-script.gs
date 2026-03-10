// ════════════════════════════════════════════════════
// DYP — Google Apps Script
// Recibe data del formulario → Google Sheets + Drive
//
// INSTRUCCIONES DE INSTALACIÓN:
// 1. Ve a script.google.com → New Project
// 2. Pega este código completo
// 3. Cambia SHEET_ID y FOLDER_ID abajo
// 4. Click Deploy → New Deployment → Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copia la URL del deployment → pégala en index.html
// ════════════════════════════════════════════════════

// ── CONFIGURACIÓN ── Cambia estos dos valores
const SHEET_ID   = 'TU_GOOGLE_SHEET_ID_AQUI';   // URL del Sheet: .../d/[ESTE_ID]/edit
const FOLDER_ID  = 'TU_GOOGLE_DRIVE_FOLDER_ID'; // URL del folder: .../folders/[ESTE_ID]

// Columnas del Sheet (en orden)
const HEADERS = [
  'Fecha',
  'Nombre',
  'Apellido',
  'WhatsApp',
  'Email',
  'Ocupación',
  'LinkedIn',
  'Instagram',
  'Facebook',
  'TikTok',
  'Twitter/X',
  'Threads',
  'CV / Résumé',
  'Estado'
];

// ── MAIN: recibe el POST del formulario ──
function doPost(e) {
  try {
    // Handle both application/json and text/plain
    const raw = e.postData ? e.postData.contents : '';
    const data = JSON.parse(raw);

    // Add CORS headers
    const output = ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

    // 1. Escribir en Google Sheets
    const sheet = getOrCreateSheet();
    const resumeLink = data.resumeBase64 ? saveResumeToDrive(data) : '—';

    const row = [
      new Date().toLocaleString('es-DO', { timeZone: 'America/New_York' }),
      data.firstName   || '',
      data.lastName    || '',
      data.whatsapp    || '',
      data.email       || '',
      data.occupation  || '',
      data.linkedin    || '',
      data.instagram   || '',
      data.facebook    || '',
      data.tiktok      || '',
      data.twitter     || '',
      data.threads     || '',
      resumeLink,
      'Nuevo ✅'
    ];

    sheet.appendRow(row);

    // 2. Formatear fila nueva
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 14).setBackground('#d4edda');

    return output;

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Obtiene o crea la hoja con headers ──
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let sheet   = ss.getSheetByName('Miembros DYP');

  if (!sheet) {
    sheet = ss.insertSheet('Miembros DYP');
    // Headers
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setValues([HEADERS]);
    headerRange.setBackground('#0B3C6F');
    headerRange.setFontColor('#C9A227');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);
    sheet.setFrozenRows(1);
    // Column widths
    sheet.setColumnWidth(1, 160);  // Fecha
    sheet.setColumnWidth(2, 140);  // Nombre
    sheet.setColumnWidth(3, 140);  // Apellido
    sheet.setColumnWidth(4, 140);  // WhatsApp
    sheet.setColumnWidth(5, 200);  // Email
    sheet.setColumnWidth(6, 200);  // Ocupación
    sheet.setColumnWidths(7, 6, 160); // Redes
    sheet.setColumnWidth(13, 200); // CV
    sheet.setColumnWidth(14, 100); // Estado
  }

  return sheet;
}

// ── Guarda el CV en Google Drive ──
function saveResumeToDrive(data) {
  try {
    const folder   = DriveApp.getFolderById(FOLDER_ID);
    const decoded  = Utilities.base64Decode(data.resumeBase64);
    const blob     = Utilities.newBlob(decoded, data.resumeMime, data.resumeName);
    const file     = folder.createFile(blob);
    file.setName(`CV — ${data.firstName} ${data.lastName} — ${new Date().toLocaleDateString('es-DO')}`);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch(err) {
    return 'Error guardando CV: ' + err.message;
  }
}

// ── GET: prueba que el script esté activo ──
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'DYP Webhook activo ✅' }))
    .setMimeType(ContentService.MimeType.JSON);
}
