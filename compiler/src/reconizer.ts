import { TokenCategory as TC } from './token';

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

  static isSignal(
    char: string,
  ): { n: number; name: string; s?: string } | undefined {
    const signals = {
      '[': TC.BRACKET_SQUARE_LEFT,
      ']': TC.BRACKET_SQUARE_RIGHT,
      '(': TC.PARENTHESES_LEFT,
      ')': TC.PARENTHESES_RIGHT,
      '{': TC.BRACKET_CURLY_LEFT,
      '}': TC.BRACKET_CURLY_RIGHT,
      ',': TC.COMMA,
      '.': TC.PERIOD,
      ';': TC.SEMI_COLON,
    };

    return signals[char];
  }

  // static isArithmetic(char: string): boolean {
  //   const arithmetics = {
  //     '+': true,
  //     '-': true,
  //     '*': true,
  //     '/': true,
  //   };

  //   switch(char) {
  //     case '+':
  //       return TC.PLUS
  //     case '-':
  //       return TC.MINUS
  //   }

  //   return !!arithmetics[char];
  // }

  static isBlanc(char: string): boolean {
    const blanc = {
      ' ': true,
      '\t': true,
      '\n': true,
      '\r': true,
    };

    return !!blanc[char];
  }

  static isBoolean(
    value: string,
  ): { n: number; name: string; s?: string } | undefined {
    if (value === 'true') return TC.TRUE;
    if (value === 'false') return TC.FALSE;
  }

  static isReserved(
    value: string,
  ): { n: number; name: string; s?: string } | undefined {
    const reserveds = {
      int: TC.R_INT,
      float: TC.R_FLOAT,
      char: TC.R_CHAR,
      string: TC.R_STRING,
      bool: TC.R_BOOL,
      undefined: TC.R_UNDEFINED,
      if: TC.R_IF,
      else: TC.R_ELSE,
      elseif: TC.R_ELSEIF,
      loop: TC.R_LOOP,
      while: TC.R_WHILE,
      for: TC.R_FOR,
      do: TC.R_DO,
      start: TC.R_START,
      get: TC.R_GET,
      put: TC.R_PUT,
      function: TC.R_FUNCTION,
      return: TC.R_RETURN,
      size: TC.R_SIZE,
    };

    return reserveds[value];
  }
}
