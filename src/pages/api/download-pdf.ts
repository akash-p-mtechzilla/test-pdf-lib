
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { page1 } from "@/page1";
import { page2 } from "@/page2";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generatePdf(html: string, cloudlayerConfig: any) {
  const encodedHtml = Buffer.from(html).toString("base64");


  const response = await axios.post(
    process.env.CLOUDLAYER_URL!,
    {
      ...cloudlayerConfig,
      html: encodedHtml,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLOUDLAYER_API!,
      },
      responseType: "arraybuffer",
    }
  );

  console.log("response data", response)
  return response.data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    // Generate title page PDF
    const titlePageHtml = page1();
    const titlePagePdf = await generatePdf(titlePageHtml, {
      projectId: process.env.CLOUDLAYER_TITLE_PAGE_ID!, // You'll need to create a new template for the title page
      format: "a4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    // Generate main content PDF
    const mainContentHtml = page2()
    const mainContentPdf = await generatePdf(mainContentHtml, {
      projectId: process.env.CLOUDLAYER_PROGRAM_DETAILS_ID!,
      format: "a4",
      printBackground: true,
      displayHeaderFooter: true,
      preferCSSPageSize: true,
      margin: {
        top: "100px",
        right: "32px",
        bottom: "60px",
        left: "32px",
      },
    });

    // Merge PDFs
    const mergedPdf = await PDFDocument.create();
    mergedPdf.registerFontkit(fontkit);
    const titleDoc = await PDFDocument.load(titlePagePdf);
    const mainDoc = await PDFDocument.load(mainContentPdf);

    const titlePages = await mergedPdf.copyPages(
      titleDoc,
      titleDoc.getPageIndices()
    );
    const mainPages = await mergedPdf.copyPages(
      mainDoc,
      mainDoc.getPageIndices()
    );

    titlePages.forEach((page) => mergedPdf.addPage(page));
    mainPages.forEach((page) => mergedPdf.addPage(page));


    const fontUrl =
      "https://cdn.jsdelivr.net/fontsource/fonts/open-sans@latest/latin-400-normal.woff";
    const fontRes = await axios.get(fontUrl, { responseType: "arraybuffer" });
    const openSansFontBytes = fontRes.data;
    const openSansFont = await mergedPdf.embedFont(openSansFontBytes);

    const pages = mergedPdf.getPages();
    const totalPages = pages.length;
    pages.forEach((page, index) => {
      const { width } = page.getSize();

      page.drawText(`Downloaded July 28th, 2025`, {
        x: 40,
        y: 20,
        size: 8,
        font: openSansFont,
        color: rgb(37 / 255, 37 / 255, 37 / 255),
      });
      // Draw the page number at the bottom right corner
      page.drawText(`${index + 1} of ${totalPages}`, {
        x: width - 100,
        y: 20,
        size: 8,
        font: openSansFont,
        color: rgb(37 / 255, 37 / 255, 37 / 255),
      });

    })

    const finalPdfBytes = await mergedPdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=program-details.pdf"
    );

    res.status(200).send(Buffer.from(finalPdfBytes));
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return res.status(500).json({ error: "Failed to generate PDF" });
  }
}
