/* eslint-disable quotes */
import { AnalisadorLexico } from './analisadorLexico';
import { Token, TokenCat, TokenCategory as TC } from './token';
import { Reconizer as RZ } from './reconizer';

export class AnalisadorSintatico {
  tk: Token;
  cacheP: Token;
  cacheN: Token;
  epsilon: 'ε' = 'ε';
  constructor(private lexico: AnalisadorLexico) {
    this.getNext();
  }

  getNext(): void {
    if (this.cacheN) {
      this.tk = this.cacheN;
      this.cacheN = undefined;
    } else {
      this.cacheP = this.tk;
      this.tk = this.lexico.nextToken();
    }
  }

  getPrevious(): void {
    this.cacheN = this.tk;
    this.tk = this.cacheP;
    this.cacheP = undefined;
  }

  tkEqualCat(cat: number): boolean {
    return this.tk.category === cat;
  }

  getNextPrintValideCategoryOrThrow(category: TokenCat): void {
    this.getNext();
    this.printTK();
    if (!this.tkEqualCat(category.n)) {
      this.thorwError(category.s || category.name);
    }
  }

  printTK(): void {
    this.tk.toLogFormated(
      this.lexico.lineCount,
      this.lexico.column - this.tk.value.length + 1,
    );
  }

  printPr(prod: string): void {
    console.info(`          ${prod}`);
  }

  thorwError(expectedCategory: string, clear?: boolean): void {
    throw new Error(
      clear
        ? expectedCategory
        : `${expectedCategory} esperado, obtido: ${this.tk.value}. L: ${
            this.lexico.lineCount
          } C: ${this.lexico.column - this.tk.value.length + 1}`,
    );
  }

  S(): void {
    this.printPr('S = Principal');
    this.Principal();
  }

  Principal(): void {
    this.printPr("Principal = 'start' '{' Programa '}' ';'");
    this.printTK();
    if (this.tk.category === TC.R_START.n) {
      this.getNext();
      this.printTK();

      if (this.tk.category === TC.BRACKET_CURLY_LEFT.n) {
        this.Programa();

        this.getNext();
        this.printTK();
        if (this.tk.category === TC.BRACKET_CURLY_RIGHT.n) {
          this.getNext();
          this.printTK();

          if (this.tk.category === TC.SEMI_COLON.n) {
            return;
          } else
            throw new Error(
              `${TC.SEMI_COLON.s} expected, got: ${this.tk.value}.`,
            );
        } else
          throw new Error(
            `${TC.BRACKET_CURLY_RIGHT.s} expected, got: ${this.tk.value}.`,
          );
      } else
        throw new Error(
          `${TC.BRACKET_CURLY_LEFT.s} expected, got: ${this.tk.value}.`,
        );
    } else throw new Error(`${TC.R_START.s} expected, got: ${this.tk.value}.`);
  }

  Programa(): void {
    this.getNext();
    if (RZ.isTypeCategory(this.tk.category)) {
      this.getPrevious();
      this.printPr('Programa = DeclaraVar Programa');

      this.DeclaraVar();
      return this.Programa();
    } else if (this.tk.category === TC.R_FUNCTION.n) {
      this.getPrevious();
      this.printPr('Programa = Funcao Programa');
      this.Funcao();
      return this.Programa();
    } else if (RZ.isFirstDeInstrucao(this.tk.category)) {
      this.getPrevious();
      this.printPr('Programa = Instrucao Programa');
      this.Instrucao();
      return this.Programa();
    } else {
      this.getPrevious();
      this.printPr('Programa =  ε');
    }
  }

  DeclaraVar(): void {
    this.printPr("DeclaraVar = Type Id ArrayDecl IniciarId ListaId ';'");
    this.Type();

    this.Id();

    this.ArrayDecl();
    this.IniciarId();
    this.ListaId();

    this.getNext();
    if (this.tk.category === TC.SEMI_COLON.n) return;
    else this.thorwError(TC.SEMI_COLON.s);
  }

  Type(): void {
    this.printPr("Type = 'int' | 'float' | 'char' | 'string' | 'bool'");
    this.getNext();
    this.printTK();

    if (RZ.isTypeCategory(this.tk.category)) {
      return;
    } else this.thorwError('Type');
  }

  TypeFuncao(): void {
    this.getNext();

    if (this.tk.category === TC.R_UNDEFINED.n) {
      this.printPr("TypeFuncao = 'undefined'");
      this.printTK();
      return;
    } else {
      this.getPrevious();
      this.printPr('TypeFuncao = Type ArrayType');
      this.Type();
      this.ArrayType();
    }
  }

  ArrayType(): void {
    this.getNext();

    if (this.tk.category !== TC.BRACKET_SQUARE_LEFT.n) {
      this.printPr('ArrayType = ' + this.epsilon);
      this.getPrevious();
      return;
    }
    this.printPr("ArrayType = '[' ']'");
    this.printTK();

    this.getNext();
    if (this.tk.category !== TC.BRACKET_SQUARE_RIGHT.n) {
      this.thorwError(TC.BRACKET_SQUARE_RIGHT.s);
    }

    this.printTK();
  }

  Id(): void {
    this.printPr("Id = 'id'");
    this.getNext();
    this.printTK();

    if (this.tk.category === TC.ID.n) return;
    else this.thorwError(TC.ID.name);
  }

  ArrayDecl(): void {
    this.getNext();
    if (this.tk.category !== TC.BRACKET_SQUARE_LEFT.n) {
      this.printPr('ArrayDecl = ε');
      this.getPrevious();
      return;
    } else {
      this.printPr("ArrayDecl = '[' ExpNum ']'");
      this.printTK();

      this.ExpNum();

      this.getNext();
      this.printTK();
      if (this.tk.category === TC.BRACKET_SQUARE_RIGHT.n) return;
      else this.thorwError(TC.BRACKET_SQUARE_RIGHT.s);
    }
  }

  IniciarId(): void {
    this.getNext();
    if (this.tk.category !== TC.ASSIGNMENT.n) {
      this.printPr('IniciarId =  ε');
      this.getPrevious();
      return;
    } else {
      this.printPr("IniciarId = '=' Expressao");
      this.printTK();
      this.ExpNum();
      return;
    }
  }

  ListaId(): void {
    this.getNext();
    if (this.tk.category !== TC.COMMA.n) {
      this.printPr('ListaId = ε');
      this.getPrevious();
      return;
    } else {
      this.printPr("ListaId = ',' Id ArrayDecl IniciarId ListaId");
      this.printTK();

      this.Id();

      this.ArrayDecl();
      this.IniciarId();
      this.ListaId();
    }
  }

  Funcao(): void {
    this.getNext();

    if (this.tk.category !== TC.R_FUNCTION.n) {
      this.thorwError(TC.R_FUNCTION.s);
    }

    this.printPr(
      "Funcao = 'function' TypeFuncao Id '(' DeclParametros ')' '{' Programa '}'",
    );
    this.printTK();

    this.TypeFuncao();
    this.Id();

    this.getNext();
    this.printTK();
    if (!this.tkEqualCat(TC.PARENTHESES_LEFT.n)) {
      this.thorwError(TC.PARENTHESES_LEFT.s);
    }

    this.DeclParametros();

    this.getNext();
    this.printTK();
    if (!this.tkEqualCat(TC.PARENTHESES_RIGHT.n)) {
      this.thorwError(TC.PARENTHESES_RIGHT.s);
    }

    this.getNext();
    this.printTK();

    if (!this.tkEqualCat(TC.BRACKET_CURLY_LEFT.n)) {
      this.thorwError(TC.BRACKET_CURLY_LEFT.s);
    }

    this.Programa();

    this.getNext();
    this.printTK();
    if (!this.tkEqualCat(TC.BRACKET_CURLY_RIGHT.n)) {
      this.thorwError(TC.BRACKET_CURLY_RIGHT.s);
    }
  }

  DeclParametros(): void {
    this.getNext();
    if (!RZ.isTypeCategory(this.tk.category)) {
      this.getPrevious();
      this.printPr('DeclParametros = ' + this.epsilon);
      return;
    }

    this.getPrevious();
    this.printPr('DeclParametros = Type ArrayType Id ListaParametros');

    this.Type();
    this.ArrayType();
    this.Id();
    this.ListaParametros();
  }

  ListaParametros(): void {
    this.getNext();
    if (!this.tkEqualCat(TC.COMMA.n)) {
      this.getPrevious();
      this.printPr('ListaParametros = ' + this.epsilon);
      return;
    }

    this.printPr("ListaParametros = ',' Type ArrayType Id ListaParametros");
    this.printTK();

    this.Type();
    this.ArrayType();
    this.Id();
    this.ListaParametros();
  }

  Instrucao(): void {
    this.getNext();
    if (!RZ.isFirstDeInstrucao(this.tk.category)) {
      this.getPrevious();
      this.printPr('Instrucao = ' + this.epsilon);
      return;
    }

    this.printPr('Instrucao = Command Instrucao');
    this.getPrevious();
    this.Command();
    this.Instrucao();
  }

  Command(): void {
    this.getNext();
    if (this.tkEqualCat(TC.R_IF.n)) {
      this.getPrevious();
      this.printPr('Command = If');
      this.If();
      return;
    }
    if (this.tkEqualCat(TC.R_WHILE.n)) {
      this.getPrevious();
      this.printPr('Command = While');
      this.While();
      return;
    }
    if (this.tkEqualCat(TC.R_DO.n)) {
      this.getPrevious();
      this.printPr('Command = DoWhile');
      this.DoWhile();
      return;
    }
    if (this.tkEqualCat(TC.R_FOR.n)) {
      this.getPrevious();
      this.printPr('Command = For');
      this.For();
      return;
    }
    if (this.tkEqualCat(TC.R_LOOP.n)) {
      this.getPrevious();
      this.printPr('Command = Loop');
      this.Loop();
      return;
    }
    if (this.tkEqualCat(TC.R_RETURN.n)) {
      this.getPrevious();
      this.printPr('Command = Retorno');
      this.Retorno();
      return;
    }
    if (this.tkEqualCat(TC.ID.n)) {
      this.getPrevious();
      this.printPr('Command = AtrOuFunInst');
      this.AtrOuFunInst();
      return;
    }
    if (this.tkEqualCat(TC.R_GET.n)) {
      this.getPrevious();
      this.printPr('Command = Get');
      this.Get();
      return;
    }
    if (this.tkEqualCat(TC.R_PUT.n)) {
      this.getPrevious();
      this.printPr('Command = Put');
      this.Put();
      return;
    }
  }

  If(): void {
    this.printPr("If = 'if' '(' Expressao ')' '{' Programa '}' Elseif Else");

    this.getNextPrintValideCategoryOrThrow(TC.R_IF);
    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_LEFT);

    this.Expressao();

    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_LEFT);

    this.Programa();

    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_RIGHT);

    this.Elseif();
    this.Else();
  }

  Elseif(): void {
    this.getNext();
    if (!this.tkEqualCat(TC.R_ELSEIF.n)) {
      this.getPrevious();
      this.printPr('Elseif = ' + this.epsilon);
      return;
    }

    this.printPr("Elseif = 'elseif' '(' Expressao ')' '{' Programa '}'");
    this.printTK();

    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_LEFT);

    this.Expressao();

    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_LEFT);

    this.Programa();
    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_RIGHT);

    this.Elseif();
  }

  Else(): void {
    this.getNext();
    if (!this.tkEqualCat(TC.R_ELSE.n)) {
      this.getPrevious();
      this.printPr('Else = ' + this.epsilon);
      return;
    }

    this.printPr("Else = 'else' '{' Programa '}'");
    this.printTK();

    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_LEFT);

    this.Programa();

    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_RIGHT);
  }

  While(): void {
    this.printPr("While = 'while' '(' Expressao ')' '{' Programa '}'");
    this.getNextPrintValideCategoryOrThrow(TC.R_WHILE);
    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_LEFT);

    this.Expressao();

    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_LEFT);

    this.Programa();

    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_RIGHT);
  }

  DoWhile(): void {
    this.printPr("DoWhile = 'do' '{' Programa '}' 'while' '(' Expressao ')'");
    this.getNextPrintValideCategoryOrThrow(TC.R_DO);
    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_LEFT);

    this.Programa();

    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_RIGHT);
    this.getNextPrintValideCategoryOrThrow(TC.R_WHILE);
    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_LEFT);

    this.Expressao();

    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
  }

  For(): void {
    this.printPr(
      "For = 'for' '(' [DeclaraVarFor] ';' [Expressao] ';' [AtribuicaoFor] ')' '{' Programa '}' ",
    );
    this.getNextPrintValideCategoryOrThrow(TC.R_FOR);
    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_LEFT);

    this.getNext();
    if (!this.tkEqualCat(TC.SEMI_COLON.n)) {
      this.getPrevious();
      this.DeclaraVarFor();

      this.getNextPrintValideCategoryOrThrow(TC.SEMI_COLON);
    } else {
      this.printTK();
    }

    this.getNext();
    if (!this.tkEqualCat(TC.SEMI_COLON.n)) {
      this.getPrevious();
      this.Expressao();

      this.getNextPrintValideCategoryOrThrow(TC.SEMI_COLON);
    } else {
      this.printTK();
    }

    this.getNext();
    if (!this.tkEqualCat(TC.PARENTHESES_RIGHT.n)) {
      this.getPrevious();
      this.AtribuicaoFor();

      this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
    } else {
      this.printTK();
    }

    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_LEFT);

    this.Programa();

    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_RIGHT);
  }

  DeclaraVarFor(): void {
    this.printPr('DeclaraVarFor = Type Id ArrayDecl IniciarId ListaId');
    this.Type();

    this.Id();

    this.ArrayDecl();
    this.IniciarId();
    this.ListaId();
  }

  AtribuicaoFor(): void {
    this.printPr("AtribuicaoFor = Id '=' Expressao ListaAtriFor");

    this.Id();

    this.getNextPrintValideCategoryOrThrow(TC.ASSIGNMENT);

    this.Expressao();

    this.ListaAtriFor();
  }

  ListaAtriFor(): void {
    this.getNext();
    if (!this.tkEqualCat(TC.COMMA.n)) {
      this.getPrevious();
      this.printPr('ListaAtriFor = ' + this.epsilon);
      return;
    }

    this.printPr("ListaAtriFor = ',' Id '=' Expressao ListaAtriFor");
    this.printTK();

    this.Id();

    this.getNextPrintValideCategoryOrThrow(TC.ASSIGNMENT);

    this.Expressao();

    this.ListaAtriFor();
  }

  Loop(): void {
    this.printPr(
      "Loop = 'loop' '(' 'int' Id ';' ExpNum ';' ExpNum ';' [ExpNum] ')' '{' Programa '}'",
    );

    this.getNextPrintValideCategoryOrThrow(TC.R_LOOP);
    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_LEFT);
    this.getNextPrintValideCategoryOrThrow(TC.R_INT);

    this.Id();

    this.getNextPrintValideCategoryOrThrow(TC.SEMI_COLON);

    this.ExpNum();

    this.getNextPrintValideCategoryOrThrow(TC.SEMI_COLON);

    this.ExpNum();

    this.getNextPrintValideCategoryOrThrow(TC.SEMI_COLON);

    this.getNext();
    if (!this.tkEqualCat(TC.PARENTHESES_RIGHT.n)) {
      this.getPrevious();
      this.ExpNum();

      this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
    } else {
      this.printTK();
    }

    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_LEFT);

    this.Programa();

    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_CURLY_RIGHT);
  }

  Retorno(): void {
    this.printPr("Retorno = 'return' Expressao ';'");

    this.getNextPrintValideCategoryOrThrow(TC.R_RETURN);

    this.Expressao();

    this.getNextPrintValideCategoryOrThrow(TC.SEMI_COLON);
  }

  AtrOuFunInst(): void {
    this.printPr('AtrOuFunInst = Id EqualOuCall');
    this.Id();
    this.ArrayDecl();
    this.EqualOuCall();
  }

  EqualOuCall(): void {
    this.getNext();

    if (this.tkEqualCat(TC.ASSIGNMENT.n)) {
      this.getPrevious();
      this.printPr('EqualOuCall = Atribuicao');
      this.Atribuicao();
    } else if (this.tkEqualCat(TC.PARENTHESES_LEFT.n)) {
      this.getPrevious();
      this.printPr('EqualOuCall = FuncaoInstrucao');
      this.FuncaoInstrucao();
    } else {
      this.thorwError(`${TC.ASSIGNMENT.s} ou ${TC.PARENTHESES_LEFT.n}`);
    }
  }

  Atribuicao(): void {
    this.printPr("Atribuicao = '=' Expressao ';'");
    this.getNextPrintValideCategoryOrThrow(TC.ASSIGNMENT);

    this.Expressao();

    this.getNextPrintValideCategoryOrThrow(TC.SEMI_COLON);
  }

  FuncaoInstrucao(): void {
    this.printPr("FuncaoInstrucao = '(' Argumentos ')' ';'");

    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_LEFT);

    this.Argumentos();

    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
    this.getNextPrintValideCategoryOrThrow(TC.SEMI_COLON);
  }

  Argumentos(): void {
    this.getNext();

    if (this.tkEqualCat(TC.PARENTHESES_RIGHT.n)) {
      this.getPrevious();
      this.printPr('Argumentos = ' + this.epsilon);
      return;
    }

    this.printPr('Argumentos = Expressao ArgumentosLista');
    this.getPrevious();

    this.Expressao();
    this.ArgumentosLista();
  }

  ArgumentosLista(): void {
    this.getNext();

    if (!this.tkEqualCat(TC.COMMA.n)) {
      this.getPrevious();
      this.printPr('ArgumentosLista = ' + this.epsilon);
      return;
    }

    this.printPr("ArgumentosLista = ',' Expressao ArgumentosLista");
    this.printTK();

    this.Expressao();

    this.ArgumentosLista();
  }

  Get(): void {
    this.printPr("Get = 'get' '(' Argumentos ')' ';'");
    this.getNextPrintValideCategoryOrThrow(TC.R_GET);
    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_LEFT);

    this.Argumentos();

    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
    this.getNextPrintValideCategoryOrThrow(TC.SEMI_COLON);
  }

  Put(): void {
    this.printPr("Get = 'put' '(' Argumentos ')' ';'");
    this.getNextPrintValideCategoryOrThrow(TC.R_PUT);
    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_LEFT);

    this.Argumentos();

    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
    this.getNextPrintValideCategoryOrThrow(TC.SEMI_COLON);
  }

  Expressao(): void {
    this.printPr('Expressao = ExpBool');
    this.ExpBool();
  }

  ExpBool(): void {
    this.printPr('ExpBool = ExpA ExpOr');
    this.ExpA();
    this.ExpOr();
  }

  ExpOr(): void {
    this.getNext();
    if (!this.tkEqualCat(TC.OR.n)) {
      this.getPrevious();
      this.printPr('ExpOr = ' + this.epsilon);
      return;
    }

    this.printPr("ExpOr = '|' ExpA ExpOr");
    this.printTK();

    this.ExpA();
    this.ExpOr();
  }

  ExpA(): void {
    this.printPr('ExpA = ExpN ExpAnd');

    this.ExpN();
    this.ExpAnd();
  }

  ExpAnd(): void {
    this.getNext();
    if (!this.tkEqualCat(TC.AND.n)) {
      this.getPrevious();
      this.printPr('ExpAnd = ' + this.epsilon);
      return;
    }

    this.printPr("ExpAnd = '&' ExpN ExpAnd");
    this.printTK();

    this.ExpN();
    this.ExpAnd();
  }

  ExpN(): void {
    this.getNext();

    if (this.tkEqualCat(TC.NOT.n)) {
      this.printPr("ExpN = '!' ExpressaoLogica");
      this.printTK();
      this.ExpressaoLogica();
    } else {
      this.printPr('ExpN = ExpressaoLogica');
      this.getPrevious();
      this.ExpressaoLogica();
    }
  }

  ExpressaoLogica(): void {
    this.printPr('ExpressaoLogica = ValorLogico OperacaoLogica');

    this.ValorLogico();
    this.OperacaoLogica();
  }

  OperacaoLogica(): void {
    this.getNext();
    if (!RZ.isLogicOperator(this.tk.category)) {
      this.getPrevious();
      this.printPr('OperacaoLogica = ' + this.epsilon);
      return;
    }

    this.printPr('OperacaoLogica = OperadoresLogicos ValorLogico');
    this.getPrevious();

    this.OperadoresLogicos();
    this.ValorLogico();
  }

  ValorLogico(): void {
    this.printPr('ValorLogico = ExpNum');

    this.ExpNum();
  }

  ExpNum(): void {
    this.printPr('ExpNum = ExpM ExpAditiva');
    this.ExpM();
    this.ExpAditiva();
  }

  ExpAditiva(): void {
    this.getNext();

    if (!this.tkEqualCat(TC.PLUS.n) && !this.tkEqualCat(TC.MINUS.n)) {
      this.getPrevious();
      this.printPr('ExpAditiva = ' + this.epsilon);
      return;
    }

    this.printPr(`ExpAditiva = ${this.tk.value} ExpM ExpAditiva`);
    this.printTK();

    this.ExpM();
    this.ExpAditiva();
  }

  ExpM(): void {
    this.printPr('ExpM = ExpUnaria ExpMulti');

    this.ExpUnaria();
    this.ExpMulti();
  }

  ExpMulti(): void {
    this.getNext();

    if (!this.tkEqualCat(TC.ASTERISK.n) && !this.tkEqualCat(TC.SLASH.n)) {
      this.getPrevious();
      this.printPr('ExpMulti = ' + this.epsilon);
      return;
    }

    this.printPr(`ExpMulti = ${this.tk.value} ExpUnaria ExpMulti`);
    this.printTK();

    this.ExpUnaria();
    this.ExpMulti();
  }

  ExpUnaria(): void {
    this.getNext();

    if (!this.tkEqualCat(TC.MINUS.n) && !this.tkEqualCat(TC.PLUS.n)) {
      this.getPrevious();
      this.printPr('ExpUnaria = Valor');
      this.Valor();
      return;
    }

    this.printPr(`ExpUnaria = ${this.tk.value} Valor`);
    this.printTK();

    this.Valor();
  }

  Valor(): void {
    this.getNext();

    if (this.tkEqualCat(TC.ID.n)) {
      this.getPrevious();
      this.printPr('Valor = IdOuFuncCall');
      this.IdOuFuncCall();
      return;
    }
    if (this.tkEqualCat(TC.BRACKET_SQUARE_LEFT.n)) {
      this.getPrevious();
      this.printPr('Valor = Array OperadorSize');
      this.Array();
      this.OperadorSize();
      return;
    }
    if (this.tkEqualCat(TC.PARENTHESES_LEFT.n)) {
      this.getPrevious();
      this.printPr('Valor = CastingOuExpressao');
      this.CastingOuExpressao();
      return;
    }
    if (this.tkEqualCat(TC.INTEGER.n)) {
      this.printPr("Valor = 'constanteInteira'");
      this.printTK();
      return;
    }
    if (this.tkEqualCat(TC.FALSE.n) || this.tkEqualCat(TC.TRUE.n)) {
      this.printPr("Valor = 'constanteBool'");
      this.printTK();
      return;
    }
    if (this.tkEqualCat(TC.FLOAT.n)) {
      this.printPr("Valor = 'constanteFloat'");
      this.printTK();
      return;
    }
    if (this.tkEqualCat(TC.CHAR.n) || this.tkEqualCat(TC.STRING.n)) {
      this.getPrevious();
      this.printPr('Valor = ExpString');
      this.ExpString();
      return;
    }
    if (this.tkEqualCat(TC.CONSTANT.n)) {
      this.printPr("Valor = 'constante'");
      this.printTK();
      return;
    }
  }

  IdOuFuncCall(): void {
    this.printPr('IdOuFuncCall = Id Call');
    this.Id();
    this.Call();
  }

  Call(): void {
    this.getNext();
    if (this.tkEqualCat(TC.PARENTHESES_LEFT.n)) {
      this.printPr("Call = '(' Argumentos ')'");
      this.printTK();

      this.Argumentos();

      this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
      return;
    }
    if (this.tkEqualCat(TC.PERIOD.n)) {
      this.getPrevious();
      this.printPr('Call = OperadorSize');

      this.OperadorSize();
      return;
    }
    if (this.tkEqualCat(TC.BRACKET_SQUARE_LEFT.n)) {
      this.getPrevious();
      this.printPr('Call = ArrayDecl');

      this.ArrayDecl();
      return;
    }
    this.getPrevious();
    this.printPr('Call = ' + this.epsilon);
  }

  CastingOuExpressao(): void {
    this.printPr("CastingOuExpressao = '(' TypeOrExp");
    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_LEFT);

    this.TypeOrExp();
  }

  TypeOrExp(): void {
    this.getNext();

    if (RZ.isTypeCategory(this.tk.category)) {
      this.getPrevious();
      this.printPr("TypeORExp = Type ')' Expressao");
      this.Type();
      this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
      this.Expressao();
      return;
    }

    this.printPr("TypeOrExp = Expressao ')'");
    this.getPrevious();

    this.Expressao();
    this.getNextPrintValideCategoryOrThrow(TC.PARENTHESES_RIGHT);
  }

  ExpString(): void {
    this.printPr('ExpString = Palavra OpString');
    this.Palavra();
    this.OpString();
  }

  OpString(): void {
    this.getNext();

    if (!this.tkEqualCat(TC.PLUS.n)) {
      this.getPrevious();
      this.printPr('OpString = ' + this.epsilon);
      return;
    }

    this.printPr("OpString = '+' Expressao OpString");
    this.printTK();

    this.Expressao();

    this.OpString();
  }

  Palavra(): void {
    this.getNext();

    if (this.tkEqualCat(TC.STRING.n)) {
      this.printPr("Palavra = 'string'");
      this.printTK();
      return;
    }
    if (this.tkEqualCat(TC.CHAR.n)) {
      this.printPr("Palavra = 'char'");
      this.printTK();
      return;
    } else this.thorwError('Palavra');
  }

  OperadoresLogicos(): void {
    this.getNext();
    if (!RZ.isLogicOperator(this.tk.category)) {
      this.thorwError('Operador Lógico');
    }
    this.printPr(`OperadoresLogicos = '${this.tk.value}'`);
    this.printTK();
  }

  OperadorSize(): void {
    this.getNext();
    if (!this.tkEqualCat(TC.PERIOD.n)) {
      this.getPrevious();
      this.printPr('OperadorSize = ' + this.epsilon);
      return;
    }

    this.printPr("OperadorSize = '.' 'size'");
    this.printTK();

    this.getNextPrintValideCategoryOrThrow(TC.R_SIZE);
  }

  Array(): void {
    this.printPr("Array = '[' ValorArray ']'");
    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_SQUARE_LEFT);

    this.ValorArray();

    this.getNextPrintValideCategoryOrThrow(TC.BRACKET_SQUARE_RIGHT);
  }

  ValorArray(): void {
    this.getNext();

    if (this.tkEqualCat(TC.BRACKET_SQUARE_RIGHT.n)) {
      this.getPrevious();
      this.printPr('ValorArray = ' + this.epsilon);
      return;
    }

    this.printPr('ValorArray = Valor ListaArray');
    this.getPrevious();

    this.Expressao();
    this.ListaArray();
  }

  ListaArray(): void {
    this.getNext();

    if (!this.tkEqualCat(TC.COMMA.n)) {
      this.getPrevious();
      this.printPr('ListaArray = ' + this.epsilon);
      return;
    }

    this.printPr("ListaArray = ',' Expressao ListaArray");
    this.printTK();

    this.Expressao();

    this.ArgumentosLista();
  }
}
