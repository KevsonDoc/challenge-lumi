export type IPdf = {
  numpages: number;
  version: string;
  info: {
    PDFFormatVersion: string;
    IsAcroFormPresent: boolean;
    IsXFAPresent: boolean;
    Author: string;
    Creator: string;
    Producer: string;
  };
  text: string;
};

export interface IPdfGateway {
  extract(pdfBuffer: Buffer): Promise<IPdf>;
}
