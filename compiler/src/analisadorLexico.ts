import { Token, TokenCategory as TC } from './token';
import { Reconizer as rz } from './reconizer';
import { FileHandler } from './fileHandler';
import { to4d } from './utils';

export class AnalisadorLexico {
  public column = 0;
  public lineCount = 0;
  public line = '';
  private file: FileHandler;

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
    23: true,
  };

  constructor(path: string) {
    this.file = new FileHandler(path);
    const lineConfig = this.file.getLine();
    this.line = lineConfig.line;
    this.lineCount = lineConfig.lineCount;
    this.column = 0;
  }

  private nextChar(): string {
    if (this.column >= this.line.length) {
      return null;
    }

    const char = this.line[this.column];
    this.column++;
    return char;
  }

  private nextTokenPrivate(): Token {
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
          } else if (char === '\"') {
            value += char;
            state = 13;
            // eslint-disable-next-line prettier/prettier
          } else if (char === '\'') {
            value += char;
            state = 22;
          } else if (rz.isSignal(char)) {
            value += char;
            state = 15;
          } else if (rz.isRelational(char)) {
            value += char;
            state = 8;
          } else if (rz.isRelationalUnique(char)) {
            value += char;
            state = 12;
          } else if (rz.isLetterUpperCase(char)) {
            value += char;
            state = 16;
          } else if (char === '*' || char === '/') {
            value += char;
            state = 18;
          } else if (char === '-' || char === '+') {
            value += char;
            state = 19;
          } else {
            return this.reportError(
              TC.ERROR_INVALID.name,
              value,
              this.lineCount,
              this.column,
            );
          }
          break;

        case 1:
          if (char && (rz.isLetter(char) || rz.isDigit(char))) {
            value += char;
            state = 1;
          } else state = 2;
          break;

        case 2:
          this.backColumn();
          if (rz.isBoolean(value)) {
            const tk = rz.isBoolean(value);
            return new Token(value, tk.n, tk.name);
          } else if (rz.isReserved(value)) {
            const tk = rz.isReserved(value);
            return new Token(value, tk.n, tk.name);
          } else return new Token(value, TC.ID.n, TC.ID.name);

        case 3:
          if (
            (value.length === 1 && value === '-' && char === '.') ||
            (char === '.' && value.includes('.')) ||
            rz.isLetter(char) ||
            (value[value.length - 1] === '.' && !rz.isDigit(char))
          ) {
            return this.reportError(
              TC.ERROR_NUMBER.name,
              value,
              this.lineCount,
              this.column,
            );
          }

          if (char === '.' || rz.isDigit(char)) {
            value += char;
            state = 3;
          } else state = 4;
          break;

        case 4:
          this.backColumn();
          if (value.includes('.')) {
            return new Token(value, TC.FLOAT.n, TC.FLOAT.name);
          } else return new Token(value, TC.INTEGER.n, TC.INTEGER.name);

        case 5:
          if (char !== '=') state = 6;
          else if (char === '=') {
            value += char;
            state = 7;
          }
          break;

        case 6:
          this.backColumn();
          return new Token(value, TC.ASSIGNMENT.n, TC.ASSIGNMENT.name);
        case 7:
          return new Token(value, TC.EQUAL.n, TC.EQUAL.name);
        case 8:
          if (char === '=') {
            value += char;
            state = 9;
          } else {
            state = 10;
          }
          break;
        case 9:
          if (value === '<=')
            return new Token(value, TC.LESS_EQUAL.n, TC.LESS_EQUAL.name);
          if (value === '>=')
            return new Token(value, TC.GREATER_EQUAL.n, TC.GREATER_EQUAL.name);
          if (value === '!=')
            return new Token(value, TC.NOT_EQUAL.n, TC.NOT_EQUAL.name);

        case 10:
          this.backColumn();
          if (value === '<') return new Token(value, TC.LESS.n, TC.LESS.name);
          if (value === '>')
            return new Token(value, TC.GREATER.n, TC.GREATER.name);
          if (value === '!') return new Token(value, TC.NOT.n, TC.NOT.name);

        case 11:
          break;

        case 12:
          if (value === '&') return new Token(value, TC.AND.n, TC.AND.name);
          if (value === '|') return new Token(value, TC.OR.n, TC.OR.name);

        case 13:
          if (
            // eslint-disable-next-line prettier/prettier
            char !== '\"' &&
            (char === '\n' || this.column >= this.line.length)
          ) {
            return this.reportError(
              TC.ERROR_STRING.name,
              value,
              this.lineCount,
              this.column,
            );
          }
          // eslint-disable-next-line prettier/prettier
          if (char === '\"') {
            value += char;
            state = 14;
          } else {
            value += char;
            state = 13;
          }
          break;

        case 14:
          return new Token(value, TC.STRING.n, TC.STRING.name);

        case 15:
          const tk = rz.isSignal(value);
          return new Token(value, tk.n, tk.name);

        case 16:
          if (rz.isLetterUpperCase(char) || char === '_') {
            value += char;
            state = 16;
          } else state = 17;
          break;

        case 17:
          this.backColumn();
          return new Token(value, TC.CONSTANT.n, TC.CONSTANT.name);

        case 18:
          if (value === '+') return new Token(value, TC.PLUS.n, TC.PLUS.name);
          if (value === '/') return new Token(value, TC.SLASH.n, TC.SLASH.name);
          if (value === '*')
            return new Token(value, TC.ASTERISK.n, TC.ASTERISK.name);

        case 19:
          if (rz.isDigit(char) || rz.isLetter(char)) {
            state = 21;
          } else {
            state = 20;
          }
          break;

        case 20:
          this.backColumn();
          if (value === '-') return new Token(value, TC.MINUS.n, TC.MINUS.name);
          if (value === '+') return new Token(value, TC.PLUS.n, TC.PLUS.name);

        case 21:
          this.backColumn();
          if (value === '-')
            return new Token(value, TC.MINUS_UNARY.n, TC.MINUS_UNARY.name);
          if (value === '+')
            return new Token(value, TC.PLUS_UNARY.n, TC.PLUS_UNARY.name);

        case 22:
          if (
            // eslint-disable-next-line prettier/prettier
            (value.length === 1 && char === '\'') ||
            char === '\n' ||
            this.column >= this.line.length
          ) {
            return this.reportError(
              TC.ERROR_CHAR.name,
              value,
              this.lineCount,
              this.column,
            );
          }

          // eslint-disable-next-line prettier/prettier
          if (char === '\'') {
            value += char;
            state = 23;
          } else if (value.length === 1) {
            value += char;
            state = 22;
          } else {
            return this.reportError(
              TC.ERROR_CHAR.name,
              value,
              this.lineCount,
              this.column,
            );
          }
          break;

        case 23:
          return new Token(value, TC.CHAR.n, TC.CHAR.name);

        default:
          return this.reportError(
            TC.ERROR_TOKEN.name,
            value,
            this.lineCount,
            this.column,
          );
      }

      // Apenas se não for estado final
      if (!this.finalStates[state]) {
        char = this.nextChar();
        if (!char) return null;
      }
    }
  }

  public nextToken(): Token {
    if (this.line == '') {
      return null;
    }

    if (this.column === 0) {
      this.printLine();
    }

    let token = this.nextTokenPrivate();

    if (!token) {
      if (!this.realoadLine()) return null;
      this.printLine();
      token = this.nextTokenPrivate();
    }

    token.toLogFormated(this.lineCount, this.column - token.value.length + 1);

    return token;
  }

  private realoadLine(): boolean {
    const lineConfig = this.file.getLine();

    if (!lineConfig.line) return false;

    this.line = lineConfig.line;
    this.lineCount = lineConfig.lineCount;
    this.column = 0;
    return true;
  }

  private backColumn(): void {
    this.column--;
  }

  private reportError(
    tokenName: string,
    value: string,
    l: number,
    c: number,
  ): Token {
    this.backColumn();
    return new Token(value, TC[tokenName].n, TC[tokenName].name);
  }

  private printLine(): void {
    console.info(`${to4d(this.lineCount)}  ${this.line.trimLeft()}`);
  }
}
