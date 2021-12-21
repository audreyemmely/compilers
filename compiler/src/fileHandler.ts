/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nReadlines = require('n-readlines');

export class FileHandler {
  private path: string; // Path do arquivo
  private reader: any;
  private lineCount = 0;
  /**
   * Iniciar o stream de leitura do arquivo
   * @param path caminho do arquivo
   * @default path file.anw
   */
  constructor(path = 'file.anw') {
    this.path = path;

    this.reader = new nReadlines(path);
  }

  getLine(): { line: string; lineCount: number } {
    const line = this.reader.next();
    this.lineCount++;

    return { line: line && line.toString('ascii'), lineCount: this.lineCount };
  }
}
