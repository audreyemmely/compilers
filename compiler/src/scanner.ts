import { Token } from './token';
import { Reconizer as rz } from './reconizer';

export class Scanner {
  public column = 0;
  public lineCount = 0;
  public line = '';

  private readonly finalStates = {
    2: true,
    4: true,
    6: true,
    7: true,
    9: true,
    10: true,
    12: true,
    14: true,
    15: true,
    17: true,
    18: true,
    20: true,
    21: true,
  };

  private nextChar(): string {
    if (this.column >= this.line.length) {
      return null;
    }

    const char = this.line[this.column];
    this.column++;
    return char;
  }

  private nextToken(): Token {
    let char = this.nextChar();
    if (!char) return null;

    let value = '';

    let state = 0;

    while (true) {
      // process.stdout.write(`C: ${char}  Cn: ${this.column}  S: ${state} \n`);
      switch (state) {
        case 0:
          if (rz.isBlanc(char)) {
            state = 0;
          } else if (rz.isLetterLowerCase(char)) {
            value += char;
            state = 1;
          } else if (rz.isDigit(char)) {
            value += char;
            state = 3;
          } else if (char === '=') {
            value += char;
            state = 5;
            // eslint-disable-next-line prettier/prettier
          } else if (char === '\'') {
            value += char;
            state = 13;
          } else if (rz.isSignal(char)) {
            value += char;
            state = 15;
          } else if (rz.isRelational(char)) {
            value += char;
            state = 8;
          } else if (rz.isRelationalUnique(char)) {
            value += char;
            state = 11;
          } else if (rz.isLetterUpperCase(char)) {
            value += char;
            state = 16;
          } else if (char === '*' || char === '/' || char === '+') {
            value += char;
            state = 18;
          } else if (char === '-') {
            value += char;
            state = 19;
          } else {
            throw new Error(
              `Caractere inválido: '${char}'\n Erro sintático em state:${state} | linha:${this.lineCount} | coluna:${this.column} | char ${char}`,
            );
          }
          break;
        case 1:
          if (
            char &&
            (rz.isLetterLowerCase(char) ||
              rz.isLetterUpperCase(char) ||
              rz.isDigit(char))
          ) {
            value += char;
            state = 1;
          } else state = 2;
          break;
        case 2:
          this.backColumn();
          if (rz.isBoolean(value)) return new Token(value, 'BOOLEAN');
          else if (rz.isReserved(value)) {
            if (char !== ' ' && char !== '[' && char !== ';' && char !== ')') {
              throw new Error(
                `Palavra reservada usada incorretamente. '${value}'\n Erro sintático em state:${state} | linha:${this.lineCount} | coluna:${this.column}`,
              );
            }
            return new Token(value, 'RESERVED');
          } else return new Token(value, 'ID');
        case 3:
          if (
            (value.length === 1 && value === '-' && char === '.') ||
            (char === '.' && value.includes('.')) ||
            rz.isLetter(char) ||
            (value[value.length - 1] === '.' && !rz.isDigit(char))
          ) {
            throw new Error(
              `Estrutura incorreta de número.\n Erro sintático em state:${state} | linha:${this.lineCount} | coluna:${this.column}`,
            );
          }

          if (char === '.' || rz.isDigit(char)) {
            value += char;
            state = 3;
          } else state = 4;
          break;
        case 4:
          this.backColumn();
          return new Token(value, 'NUMBER');
        case 5:
          if (char !== '=') state = 6;
          else if (char === '=') {
            value += char;
            state = 7;
          }
          break;
        case 6:
          this.backColumn();
          return new Token(value, 'ASSIGNMENT');
        case 7:
          return new Token(value, 'RELATIONAL');
        case 8:
          if (char === '=') {
            value += char;
            state = 9;
          } else if (
            rz.isDigit(char) ||
            rz.isLetter(char) ||
            // eslint-disable-next-line prettier/prettier
            char === '\'' ||
            char === ' '
          ) {
            state = 10;
          } else {
            throw new Error(
              `Erro de expressão relacional.\n Erro sintático em state:${state} | linha:${this.lineCount} | coluna:${this.column}`,
            );
          }
          break;
        case 9:
          return new Token(value, 'RELATIONAL');
        case 10:
          this.backColumn();
          return new Token(value, 'RELATIONAL');
        case 11:
          if (
            rz.isDigit(char) ||
            rz.isLetter(char) ||
            // eslint-disable-next-line prettier/prettier
            char === '\'' ||
            char === ' '
          ) {
            state = 12;
          } else {
            throw new Error(
              `Erro de expressão relacional.\n Erro sintático em state:${state} | linha:${this.lineCount} | coluna:${this.column}`,
            );
          }
          break;
        case 12:
          this.backColumn();
          return new Token(value, 'RELATIONAL');
        case 13:
          if (
            // eslint-disable-next-line prettier/prettier
            char !== '\'' &&
            (char === '\n' || this.column >= this.line.length)
          ) {
            throw new Error(
              `Caractere de fim de string não encontrado.\n Erro sintático em state:${state} | linha:${this.lineCount} | coluna:${this.column}`,
            );
          }
          // eslint-disable-next-line prettier/prettier
          if (char === '\'') {
            value += char;
            state = 14;
          } else {
            value += char;
            state = 13;
          }
          break;
        case 14:
          return new Token(value, 'STRING');
        case 15:
          return new Token(value, 'SIGNAL');
        case 16:
          if (rz.isLetterUpperCase(char) || char === '_') {
            value += char;
            state = 16;
          } else state = 17;
          break;
        case 17:
          this.backColumn();
          return new Token(value, 'CONSTANT');
        case 18:
          return new Token(value, 'ARITHMETIC');
        case 19:
          if (char === ' ') {
            state = 20;
          } else if (rz.isDigit(char) || rz.isLetter(char)) {
            state = 21;
          } else {
            throw new Error(
              `Expressão aritmética inválida. \n Erro sintático em state:${state} | linha:${this.lineCount} | coluna:${this.column}`,
            );
          }
          break;
        case 20:
          this.backColumn();
          return new Token(value, 'ARITHMETIC');
        case 21:
          this.backColumn();
          return new Token(value, 'UNARY');
        default:
          throw new Error(
            `Valor não indentificado. '${value}'\n Erro sintático em state:${state} | linha:${this.lineCount} | coluna:${this.column}`,
          );
      }

      // Apenas se não for estado final
      if (!this.finalStates[state]) {
        char = this.nextChar();
        if (!char) return null;
      }
    }
  }

  public processLine(line: string, lineCount: number): void {
    this.lineCount = lineCount;
    this.line = line;
    this.column = 0;

    console.info(line);
    while (true) {
      const token = this.nextToken();
      if (!token) {
        return;
      }
      token.toLogFormated(this.lineCount, this.column - token.value.length + 1);
      process.stdout.write('\n');
    }
  }

  private backColumn(): void {
    this.column--;
  }
}
