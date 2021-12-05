export class Reconizer {
  static isDigit(char: string): boolean {
    const charCode = char.charCodeAt(0);
    return charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0);
  }

  static isLetter(char: string): boolean {
    return this.isLetterLowerCase(char) || this.isLetterUpperCase(char);
  }

  static isLetterLowerCase(char: string): boolean {
    const charCode = char.charCodeAt(0);
    return charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0);
  }

  static isLetterUpperCase(char: string): boolean {
    const charCode = char.charCodeAt(0);
    return charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0);
  }

  static isRelationalUnique(char: string): boolean {
    const operators = {
      '&': true,
      '|': true,
    };

    return !!operators[char];
  }

  static isRelational(char: string): boolean {
    const operators = {
      '>': true,
      '<': true,
      '!': true,
    };

    return !!operators[char];
  }

  static isSignal(char: string): boolean {
    const signals = {
      '[': true,
      ']': true,
      '(': true,
      ')': true,
      '{': true,
      '}': true,
      ',': true,
      ';': true,
    };

    return !!signals[char];
  }

  static isArithmetic(char: string): boolean {
    const arithmetics = {
      '+': true,
      '-': true,
      '*': true,
      '/': true,
    };

    return !!arithmetics[char];
  }

  static isBlanc(char: string): boolean {
    const blanc = {
      ' ': true,
      '\t': true,
      '\n': true,
      '\r': true,
    };

    return !!blanc[char];
  }

  static isBoolean(value: string): boolean {
    return value === 'true' || value == 'false';
  }

  static isReserved(value: string): boolean {
    const reserveds = {
      int: true,
      start: true,
    };
    return !!reserveds[value];
  }
}
