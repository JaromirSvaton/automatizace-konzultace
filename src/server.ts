import { Elysia } from 'elysia';
import { processDocument } from './processDocument.ts';

interface RequestBody {
  projectName: string;
  programName: string;
  clientName: string;
  keyAccountName: string;
}

const app = new Elysia()
  .post('/process', async ({ body }: { body: RequestBody }) => {
    try {
      const { projectName, programName, clientName, keyAccountName } = body;

      if (!projectName || !programName || !clientName || !keyAccountName) {
        return {
          message: 'Missing required parameters.'
        };
      }

      const inputFile = "vzor.docx.docx";
      const outputFile = `${projectName}_${programName}.docx`;

      const result = await processDocument({
        inputPath: inputFile,
        outputPath: outputFile,
        replacementText: projectName,
        clientName,
        keyAccountName,
        programName
      });

      if (result.success) {
        return {
          message: `Document '${outputFile}' was successfully created.`
        };
      } else {
        return {
          message: `Error processing document: ${result.error}`
        };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        message: `Error processing request: ${errorMessage}`
      };
    }
  })
  .listen(3000);

console.log(`🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`);
