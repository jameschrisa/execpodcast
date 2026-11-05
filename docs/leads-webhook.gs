// Google Apps Script web app behind LEADS_WEBHOOK_URL.
// Receives Executive Upskill form submissions, saves each one as a row,
// and emails the sheet owner for contact messages and guest pitches.
// Setup and redeploy steps: HANDOFF.md, "Leads webhook".
// The live copy runs in the "Executive Upskill leads" sheet. Never commit the real secret.
const SECRET = "set-a-long-random-secret";
const COLUMNS = ["submittedAt", "kind", "name", "email", "role", "topic", "message",
  "question", "host", "anonymous", "relation", "guestName", "guestRole", "guestLink",
  "why", "episodeInterest"];

function doPost(e) {
  if (!e || !e.parameter || e.parameter.key !== SECRET) {
    return ContentService.createTextOutput("forbidden");
  }
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  sheet.appendRow(COLUMNS.map((c) => (data[c] === undefined ? "" : String(data[c]))));

  if (data.kind === "contact" || data.kind === "pitch") {
    const body = data.kind === "contact"
      ? `Topic: ${data.topic}\n\n${data.message}`
      : `Guest: ${data.guestName} (${data.guestRole || ""})\nLink: ${data.guestLink || ""}\n\n${data.why}`;
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      replyTo: data.email,
      subject: `Executive Upskill ${data.kind} from ${data.name || data.email}`,
      body: `${body}\n\nFrom: ${data.name || ""} <${data.email}>`,
    });
  }
  return ContentService.createTextOutput("ok");
}
