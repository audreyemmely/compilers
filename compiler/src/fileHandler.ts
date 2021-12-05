/* eslint-disable no-console */
import * as fs from 'fs';
import * as readline from 'readline';

type ProcessLine = (line: string, lineCount: number) => void;

export class FileHandler {
  private file: Buffer; // Usado caso o usuário queira ler todo o arquivo de uma vez
  private rl: readline.Interface; // Stream para ler linha a linha.
  private stringFile = ''; // Linha em curso
  private pointer = 0; // Ponteiro para a posição da linha
  private path: string; // Path do arquivo
  private processLine: ProcessLine;

  /**
   * Iniciar o stream de leitura do arquivo
   * @param processLine Callback para processar cada linha do analisador léxico
   * @param path caminho do arquivo
   * @default path file.anw
   */
  constructor(processLine: ProcessLine, path = 'file.anw') {
    this.processLine = processLine;
    this.path = path;

    this.rl = readline.createInterface({
      input: fs.createReadStream(this.path),
    });
  }

  loadWholeFile(): void {
    this.file = fs.readFileSync(this.path);
    this.file.forEach(
      char => (this.stringFile = this.stringFile + String.fromCharCode(char)),
    );
  }

  showFile(): void {
    console.info(this.file.toString());
  }

  getFile(): Buffer {
    return this.file;
  }

  getStringFile(): string {
    return this.stringFile;
  }

  getLine(): string {
    let line = '';

    if (this.pointer >= this.stringFile.length) {
      console.error('---');
      console.error('Fim do arquivo. Restore o ponteiro.');
      console.error('---');
    }

    for (; this.pointer < this.stringFile.length; this.pointer++) {
      const char = this.stringFile[this.pointer];
      console.info({ char, v: char.charCodeAt(0), i: this.pointer });
      if (char === '\n') {
        this.pointer++;
        break;
      }

      line += char;
    }

    return line;
  }

  readLineByLine(): void {
    let lineCount = 1;

    this.rl.on('line', line => {
      this.processLine(line, lineCount);
      lineCount++;
    });
  }

  restorePointer(value = 0): void {
    this.pointer = value;
  }
}
