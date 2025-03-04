
import { PDFDocument } from "pdf-lib";
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
      headerTemplate: {
        method: "extract",
        selector: ".page-header-bob",
        style: {
          width: "100%",
          margin: "-20px 0 0 0",
          padding: "0",
        },
      },
      footerTemplate: {
        method: "extract",
        selector: ".page-footer-bob",
        style: {
          width: "100%",
          margin: "0",
          padding: "0",
        },
      },
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
