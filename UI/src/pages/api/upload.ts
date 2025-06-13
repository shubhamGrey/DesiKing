// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      return res.status(500).json({ message: "File parsing error" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    const buffer = await fs.readFile(file.filepath);

    const url =
      process.env.NEXT_PUBLIC_NEXTCLOUD_URL +
      encodeURIComponent(file.originalFilename || "upload.dat");

    console.log("Uploading to Nextcloud:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.NEXT_PUBLIC_NEXTCLOUD_USERNAME}:${process.env.NEXT_PUBLIC_NEXTCLOUD_PASSWORD}`
          ).toString("base64"),
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });

    if (!response.ok) {
      return res.status(500).json({ message: "Upload to Nextcloud failed" });
    }

    return res.status(200).json({ message: "Upload successful", path: url });
  });
}
