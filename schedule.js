const { google } = require('googleapis');
const dayjs = require('dayjs');
const markdownTable = require('markdown-table');
const fs = require('fs');
const client_id = '515075434394-e4dmddid8tq2u00k9ldqgkohs7ourb8v.apps.googleusercontent.com';
const [client_secret, access_token, refresh_token] = process.argv.slice(2);

const redirect_uri = 'https://mayandev.top';
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
process.env.HTTPS_PROXY = 'http://127.0.0.1:7890';
google.options({ proxy: 'http://127.0.0.1:7890' });
oAuth2Client.setCredentials({
  access_token,
  refresh_token,
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
  token_type: 'Bearer',
  expiry_date: 1627749865065,
});

async function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const { data } = await calendar.events.list({
    calendarId: 'c6keoilafv99p19vl7faidu8mk@group.calendar.google.com',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = data.items || [];
  const table = events.map((event, i) => {
    const start = dayjs(event.start.dateTime || event.start.date).format('MM/DD HH:mm');
    const { summary, htmlLink} = event;
    return [start, `[${summary}](${htmlLink})`];
  });
  table.unshift(['时间', '日程'])
  fs.writeFileSync('./schedule.md', markdownTable(table), 'utf8');
}

listEvents(oAuth2Client);