import { GoogleSpreadsheet } from 'google-spreadsheet';

const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(404).json({ error: 'Not found' });
    }
  
    const { data } = req.body;
  
    if(!data) {
      return res.status(400).json({ error: 'Invalid body' });
    }
  
    const { id, name, email, phone } = data;
  
    const doc = new GoogleSpreadsheet(id);
  
    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    });
  
    await doc.loadInfo();
  
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow([name, email, phone]);
  
    res.status(201).json({ lead: true });
  } catch(err) {
    res.status(500).json(err);
  }
}
