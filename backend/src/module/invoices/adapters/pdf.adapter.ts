import { IPdf, IPdfGateway } from '../gateways/pdf.gateway';
import pdf from 'pdf-parse';

export class PdfAdapter implements IPdfGateway {
  public async extract(pdfBuffer: Buffer): Promise<IPdf> {
    const payload = await pdf(pdfBuffer);

    return {
      numpages: payload.numpages,
      version: payload.version,
      info: {
        Author: payload.info.Author,
        Creator: payload.info.Creator,
        IsAcroFormPresent: payload.info.IsAcroFormPresent,
        IsXFAPresent: payload.info.IsXFAPresent,
        PDFFormatVersion: payload.info.PDFFormatVersion,
        Producer: payload.info.Producer,
      },
      text: payload.text,
    };
  }
}
