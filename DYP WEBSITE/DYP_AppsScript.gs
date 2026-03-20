// ═══════════════════════════════════════════════════════════
//  DYP – Dominican Young Professionals
//  Google Apps Script — Membership Form Handler
//  Pega este código en script.google.com y haz Deploy
// ═══════════════════════════════════════════════════════════

const SHEET_NAME = "Members"; // Cambia si tu hoja tiene otro nombre

// Columnas en el orden exacto en que aparecerán en el Google Sheet
const COLUMNS = [
  "Timestamp",
  "First Name",
  "Last Name",
  "WhatsApp",
  "Email",
  "Occupation",
  "Job Title",
  "Company / Organization",
  "Country",
  "City",
  "Years of Experience",
  "Education Level",
  "Languages",
  "Can Help With",
  "Looking For",
  "LinkedIn",
  "Instagram",
  "Facebook",
  "TikTok",
  "Twitter / X",
  "Threads",
  "Resume Filename",
  "Resume (Base64)"
];

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const p = e.parameter || {};

    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // Si la hoja no existe, la crea con los encabezados
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(COLUMNS);
      formatHeaders(sheet);
    }

    // Si la hoja existe pero está vacía, agrega los encabezados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      formatHeaders(sheet);
    }

    // Construir la fila con todos los campos
    const row = [
      new Date(),                          // Timestamp
      p.firstName    || "",
      p.lastName     || "",
      p.whatsapp     || "",
      p.email        || "",
      p.occupation   || "",
      p.jobTitle     || "",
      p.company      || "",
      p.country      || "",
      p.city         || "",
      p.experience   || "",
      p.education    || "",
      p.languages    || "",
      p.canHelp      || "",
      p.lookingFor   || "",
      p.linkedin     || "",
      p.instagram    || "",
      p.facebook     || "",
      p.tiktok       || "",
      p.twitter      || "",
      p.threads      || "",
      p.resumeName   || "",
      p.resumeBase64 || ""                 // Opcional: quita esto si no quieres guardar el CV
    ];

    sheet.appendRow(row);

    // Opcional: enviar email de notificación al equipo DYP
    // sendNotification(p);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Formatea los encabezados con color navy y texto blanco
function formatHeaders(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, COLUMNS.length);
  headerRange.setBackground("#0B3C6F");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(10);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, COLUMNS.length);
}

// ═══════════════════════════════════════════════════════════
//  OPCIONAL: Notificación por email cuando llega un nuevo miembro
//  Descomenta la función de abajo y la llamada en handleRequest
// ═══════════════════════════════════════════════════════════

/*
function sendNotification(p) {
  const to      = "info@dyprd.org"; // Cambia al email del equipo
  const subject = "🇩🇴 New DYP Member Application – " + p.firstName + " " + p.lastName;
  const body    = `
New membership application received:

Name:        ${p.firstName} ${p.lastName}
Email:       ${p.email}
WhatsApp:    ${p.whatsapp}
Occupation:  ${p.occupation}
Job Title:   ${p.jobTitle}
Company:     ${p.company}
Country:     ${p.country} – ${p.city}
Experience:  ${p.experience}
Education:   ${p.education}
Languages:   ${p.languages}
Can Help:    ${p.canHelp}
Looking For: ${p.lookingFor}
LinkedIn:    ${p.linkedin}

Timestamp: ${new Date()}
  `;
  MailApp.sendEmail(to, subject, body);
}
*/
