import { Elysia } from 'elysia';
import { processDocument } from './processDocument.ts';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';

interface RequestBody {
  projectName: string;
  programName: string;
  clientName: string;
  keyAccountName: string;
}

interface ProcessResponse {
  message: string;
  downloadUrl?: string;
}

const app = new Elysia()
  .use(cors())
  .use(staticPlugin({
    assets: 'public',
    prefix: ''
  }))
  .get('/', () => Bun.file('public/index.html'))
  .post('/process', async ({ body }: { body: RequestBody }): Promise<ProcessResponse> => {
    try {
      const { projectName, programName, clientName, keyAccountName } = body;

      if (!projectName || !programName || !clientName || !keyAccountName) {
        return {
          message: 'Missing required parameters.'
        };
      }

      const inputFile = "vzor.docx.docx";
      const outputFileName = `${projectName}_${programName}.docx`;
      const outputFile = `public/documents/${outputFileName}`;

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
          message: `Document was successfully created.`,
          downloadUrl: `/documents/${outputFileName}`
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
