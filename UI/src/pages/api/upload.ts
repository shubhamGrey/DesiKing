// import type { NextApiRequest, NextApiResponse } from "next";
// import formidable from "formidable";
// import fs from "fs/promises";

// export const config = {
//   api: { bodyParser: false },
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const form = formidable({ keepExtensions: true });

//   form.parse(req, async (err, fields, files) => {
//     if (err || !files.file) {
//       return res.status(500).json({ message: "File parsing error" });
//     }

//     const file = Array.isArray(files.file) ? files.file[0] : files.file;

//     const buffer = await fs.readFile(file.filepath);

//     const filename = encodeURIComponent(file.originalFilename || "upload.dat");

//     const webdavUrl =
//       `${process.env.NEXT_PUBLIC_NEXTCLOUD_URL}/remote.php/dav/files/` +
//       `${process.env.NEXT_PUBLIC_NEXTCLOUD_USERNAME}/AgroNexis Website Images/${filename}`;

//     const response = await fetch(webdavUrl, {
//       method: "PUT",
//       headers: {
//         Authorization:
//           "Basic " +
//           Buffer.from(
//             `${process.env.NEXT_PUBLIC_NEXTCLOUD_USERNAME}:${process.env.NEXT_PUBLIC_NEXTCLOUD_PASSWORD}`
//           ).toString("base64"),
//         "Content-Type": "application/octet-stream",
//       },
//       body: buffer,
//     });

//     if (!response.ok) {
//       return res.status(500).json({ message: "Upload to Nextcloud failed" });
//     }

//     // Step 2: Generate public share link via OCS API
//     const shareApiUrl = `${process.env.NEXT_PUBLIC_NEXTCLOUD_URL}/ocs/v2.php/apps/files_sharing/api/v1/shares`;

//     const shareResponse = await fetch(shareApiUrl, {
//       method: "POST",
//       headers: {
//         Authorization:
//           "Basic " +
//           Buffer.from(
//             `${process.env.NEXT_PUBLIC_NEXTCLOUD_USERNAME}:${process.env.NEXT_PUBLIC_NEXTCLOUD_PASSWORD}`
//           ).toString("base64"),
//         "OCS-APIRequest": "true",
//         "Content-Type": "application/x-www-form-urlencoded",
//         Accept: "application/json",
//       },
//       body: new URLSearchParams({
//         path: `/AgroNexis Website Images/${decodeURIComponent(filename)}`,
//         shareType: "3",
//         permissions: "1",
//       }),
//     });

//     const shareData = await shareResponse.json();

//     if (!shareResponse.ok || !shareData?.ocs?.data?.url) {
//       return res
//         .status(500)
//         .json({ message: "Failed to create public share link" });
//     }

//     const publicPreviewUrl = `${shareData.ocs.data.url}/preview`;

//     return res.status(200).json({
//       message: "Upload successful",
//       previewUrl: publicPreviewUrl,
//       shareUrl: shareData.ocs.data.url,
//     });
//   });
// }
