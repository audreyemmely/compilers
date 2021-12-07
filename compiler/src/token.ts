export class Token {
  public value = '';
  public category: number;
  public categoryName: string;

  constructor(value: string, categoryName: TableCategoryTokenType) {
    this.value = value;
    this.category = TableCategoryToken[categoryName];
    this.categoryName = categoryName;
  }

  toString(): void {
    console.info(
      `V: ${this.value} C: ${this.category} Cn: ${this.categoryName}`,
    );
  }

  toLogFormated(linha: number, column: number): void {
    console.info(
      `              [${linha}, ${column}] (${this.category}, ${this.categoryName}) {${this.value}}`,
    );
  }
}

type TableCategoryTokenType =
  | 'SIGNAL'
  | 'NUMBER'
  | 'STRING'
  | 'ID'
  | 'ASSIGNMENT'
  | 'RELATIONAL'
  | 'RESERVED'
  | 'BOOLEAN'
  | 'CONSTANT'
  | 'ARITHMETIC'
  | 'UNARY';

export const TableCategoryToken = {
  SIGNAL: 1,
  NUMBER: 2,
  STRING: 3,
  ID: 4,
  ASSIGNMENT: 5,
  RELATIONAL: 6,
  RESERVED: 7,
  BOOLEAN: 8,
  CONSTANT: 9,
  ARITHMETIC: 10,
  UNARY: 11,
};
