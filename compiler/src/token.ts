function to4d(n: number): string {
  const s = '000' + n;
  return s.substring(s.length - 4);
}

export class Token {
  public value = '';
  public category: number;
  public categoryName: string;

  constructor(value: string, category: number, categoryName: string) {
    this.value = value;
    this.category = category;
    this.categoryName = categoryName;
  }

  toString(): void {
    console.info(
      `V: ${this.value} C: ${this.category} Cn: ${this.categoryName}`,
    );
  }

  toLogFormated(linha: number, column: number): void {
    console.info(
      // eslint-disable-next-line prettier/prettier
      `              [${to4d(linha)}, ${to4d(column)}] (${to4d(this.category)}, ${this.categoryName}) {${this.value}}`,
    );
  }

  static getCategoryToken(
    key: string,
  ): { n: number; name: string; s?: string } {
    const tokenCategory = TokenCategory[key];
    return tokenCategory;
  }
}

export const TokenCategory = {
  INTEGER: { n: 1, name: 'INTEGER' },
  FLOAT: { n: 2, name: 'FLOAT' },
  STRING: { n: 3, name: 'STRING' },
  CHAR: { n: 4, name: 'CHAR' },
  ID: { n: 5, name: 'ID' },
  ASSIGNMENT: { n: 6, name: 'ASSIGNMENT', s: '=' },

  //RELATIONAL
  AND: { n: 7, name: 'AND', s: '&' },
  OR: { n: 8, name: 'OR', s: '|' },
  GREATER: { n: 9, name: 'GREATER', s: '>' },
  GREATER_EQUAL: { n: 10, name: 'GREATER_EQUAL', s: '>=' },
  LESS: { n: 11, name: 'LESS', s: '<' },
  LESS_EQUAL: { n: 12, name: 'LESS', s: '<=' },
  NOT: { n: 13, name: 'NOT', s: '!' },
  EQUAL: { n: 14, name: 'EQUAL', s: '==' },
  NOT_EQUAL: { n: 15, name: 'NOT_EQUAL', s: '!=' },

  //SIGNAL
  BRACKET_SQUARE_LEFT: { n: 16, name: 'BRACKET_SQUARE_LEFT', s: '[' },
  BRACKET_SQUARE_RIGHT: { n: 17, name: 'BRACKET_SQUARE_RIGHT', s: ']' },
  BRACKET_CURLY_LEFT: { n: 18, name: 'BRACKET_CURLY_LEFT', s: '{' },
  BRACKET_CURLY_RIGHT: { n: 19, name: 'BRACKET_CURLY_RIGHT', s: '}' },
  PARENTHESES_LEFT: { n: 20, name: 'PARENTHESES_LEFT', s: '(' },
  PARENTHESES_RIGHT: { n: 21, name: 'PARENTHESES_RIGHT', s: ')' },
  PERIOD: { n: 22, name: 'PERIOD', s: '.' },
  COMMA: { n: 23, name: 'COMMA', s: ',' },
  SEMI_COLON: { n: 24, name: 'SEMI_COLON', s: ';' },

  // ARITHMETIC
  PLUS: { n: 25, name: 'PLUS', s: '+' },
  MINUS: { n: 26, name: 'MINUS', s: '-' },
  ASTERISK: { n: 27, name: 'ASTERISK', s: '*' },
  SLASH: { n: 28, name: 'SLASH', s: '/' },

  //UNARY
  MINUS_UNARY: { n: 26, name: 'MINUS_UNARY', s: '-' },

  //BOOLEAN
  FALSE: { n: 26, name: 'FALSE', s: 'false' },
  TRUE: { n: 26, name: 'FALSE', s: 'true' },

  //CONSTANT
  CONSTANT: { n: 26, name: 'CONSTANT' },

  //RESERVED
  R_INT: { n: 26, name: 'R_INT', s: 'int' },
  R_FLOAT: { n: 26, name: 'R_FLOAT', s: 'float' },
  R_CHAR: { n: 26, name: 'R_CHAR', s: 'char' },
  R_STRING: { n: 26, name: 'R_STRING', s: 'string' },
  R_BOOL: { n: 26, name: 'R_BOOL', s: 'bool' },
  R_UNDEFINED: { n: 26, name: 'R_UNDEFINED', s: 'undefined' },
  R_IF: { n: 26, name: 'R_IF', s: 'if' },
  R_ELSE: { n: 26, name: 'R_ELSE', s: 'else' },
  R_ELSEIF: { n: 26, name: 'R_ELSEIF', s: 'elseif' },
  R_LOOP: { n: 26, name: 'R_LOOP', s: 'loop' },
  R_WHILE: { n: 26, name: 'R_WHILE', s: 'while' },
  R_FOR: { n: 26, name: 'R_FOR', s: 'for' },
  R_DO: { n: 26, name: 'R_DO', s: 'do' },
  R_START: { n: 26, name: 'R_START', s: 'start' },
  R_GET: { n: 26, name: 'R_GET', s: 'get' },
  R_PUT: { n: 26, name: 'R_PUT', s: 'put' },
  R_FUNCTION: { n: 26, name: 'R_FUNCTION', s: 'function' },
  R_RETURN: { n: 26, name: 'R_RETURN', s: 'return' },
  R_SIZE: { n: 26, name: 'R_SIZE', s: 'size' },
};
