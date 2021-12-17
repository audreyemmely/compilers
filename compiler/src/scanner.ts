import { Token, TokenCategory as TC } from './token';
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
    23: true,
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
          } else if (char === '*' || char === '/' || char === '+') {
            value += char;
            state = 18;
          } else if (char === '-') {
            value += char;
            state = 19;
          } else {
            return this.reportError(
              'Caractere inválido.',
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
              'Estrutura incorreta de número.',
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
              'String não finalizado corretamente.',
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
          return new Token(value, TC.MINUS.n, TC.MINUS.name);

        case 21:
          this.backColumn();
          return new Token(value, TC.MINUS_UNARY.n, TC.MINUS_UNARY.name);

        case 22:
          if (
            // eslint-disable-next-line prettier/prettier
            (value.length === 1 && char === '\'') ||
            char === '\n' ||
            this.column >= this.line.length
          ) {
            return this.reportError(
              'Caractere não finalizado corretamente.',
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
              'Caractere com tamanho maior que 1.',
              value,
              this.lineCount,
              this.column,
            );
          }
          break;

        case 23:
          return new Token(value, TC.CHAR.n, TC.CHAR.name);

        default:
          // throw new Error(
          //   `Token não indentificado.'${value}'\n Erro léxico em state:${state} | linha:${this.lineCount} | coluna:${this.column}`,
          // );
          return this.reportError(
            'Token não identificado.',
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
    }
  }

  private backColumn(): void {
    this.column--;
  }

  private reportError(
    message: string,
    value: string,
    l: number,
    c: number,
  ): Token {
    this.backColumn();
    return new Token(value, TC.ERROR.n, TC.ERROR.name);
  }
}
