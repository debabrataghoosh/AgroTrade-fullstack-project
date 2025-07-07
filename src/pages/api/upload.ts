import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const form = formidable({
    multiples: false,
    uploadDir: uploadsDir,
    keepExtensions: true,
    filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Upload failed' });
      return;
    }
    const file = files.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const fileObj = Array.isArray(file) ? file[0] : file;
    if (!fileObj || !fileObj.filepath) {
      res.status(500).json({ error: 'Filepath missing in upload' });
      return;
    }
    const fileUrl = `/uploads/${path.basename(fileObj.filepath)}`;
    res.status(200).json({ url: fileUrl });
  });
} 