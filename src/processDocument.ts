import { Document, Paragraph, Packer, TextRun } from 'docx';
import { readFile, writeFile } from 'fs/promises';

interface ProcessDocumentParams {
  inputPath: string;
  outputPath: string;
  replacementText: string;
  clientName: string;
  keyAccountName: string;
  programName: string;
}

interface ProcessResult {
  success: boolean;
  error?: string;
}

export async function processDocument({
  inputPath,
  outputPath,
  replacementText,
  clientName,
  keyAccountName,
  programName
}: ProcessDocumentParams): Promise<ProcessResult> {
  try {
    // Read the template document
    const buffer = await readFile(inputPath);
    
    // Create a new document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: replacementText })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Program: ${programName}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Klient: ${clientName}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Key Account: ${keyAccountName}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Datum: ${new Date().toLocaleDateString('cs-CZ')}` })],
          }),
        ],
      }],
    });

    // Save the document
    const outputBuffer = await Packer.toBuffer(doc);
    await writeFile(outputPath, outputBuffer);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 
