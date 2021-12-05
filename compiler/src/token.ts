export class Token {
  public value = '';
  public category: number;
  public categoryName: string;
  public linha: number;
  public column: number;

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
}

type TableCategoryTokenType =
  | 'SIGNAL'
  | 'NUMBER'
  | 'STRING'
  | 'ID'
  | 'ASSIGNMENT'
  | 'RELATIONAL'
  | 'RESERVED'
  | 'BOOLEAN';

export const TableCategoryToken = {
  SIGNAL: 1,
  NUMBER: 2,
  STRING: 3,
  ID: 4,
  ASSIGNMENT: 5,
  RELATIONAL: 6,
  RESERVED: 7,
  BOOLEAN: 8,
};
