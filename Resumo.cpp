void main() {
  // TIPOS

  int inteiro = 1;
  float flutuante = 1.0;
  char caractere = 'C';
  string palavra = 'palavra';
  bool booleano = false;

  tipo[] lista = [1, 2, 3];

  //Conversão de qualquer tipo para booleano




  // CONSTANTES LITERAIS
  float PI = 3.1419
  float EPLISON = 2.71
  char NEW_LINE = '\n'

  //to access
  // CONST.NAME_OF_CONSTANT

  // COERÇÕES (CASTING)
  // float +/-/*// int

  // OPERACOES
  /*
    Somar: 
      int, float
        EX: 1+1=2, 1.1+1.1=2.1, 1+1.1=2.1
      char, string
        EX: 'c'+'cc'='ccc'
    
    Subtrair:
      int, float
        EX: 1-1=0, 1.1-0.1=1.0
    
    Dividir:
      int, float
        EX: 2/1=1. 2.4/2=1.2
    
    Multiplicar:
      int, float
        EX: 2*2=4, 2.1*2.0=4.2
    
    Lógicas:
      AND: any&any; OR: any|any; NOT: !any
      EQUAL: any==any; DIFFERENT: any!=any;
      MAIOR QUE: any>any | >=; MENOR QUE: any<any | <=;

  */

  /*
  Conjunto mínimo de operadores
    Aritméticos:
      Aditivo: + | - | Multiplicativo: * | /
      Unário negativo: Perguntar ao Alcino
        mas basicamente=> 1-1=0 1- -1=2 e 1--1 erro
        também int a =-1 Ok.
      
    Relacionais:
      Associativos: == igual lógico; != diferente lógico;

      Definir as regras para booleano:
        Falso: false(boolean) e 0(int|float)
PERGUNTAR: Devemos definir null ou undefined?
        True: Qualquer outra coisa;
      
    Concatenação: 
      any-boolean + string/char = string

PERGUNTAR A DIFERENÇA ENTRE EXPLÍCITA E IMPLÍCITA
*/

/*
  ESTRUTURA CONDICIONAL
   if(){};
   if(){}else{};
   if(){}elseif(){}else{};

  ESTRUTURA ITERATIVA
    while(){}; do{}while();
  
  ESTRUTURA ITERATIVA POR CONTADOR
    loop(
      int/float initial_value,
      int limit_of_inital_value,
      int? increment
    ) {

    };

    loop(1,10) {};

  ENTRADA/SAÍDA:
PERGUNTAR SOBRE
  get(var1, var2,...);
  put(var1,var2, CONST.NEW_LINE...);

  ATRIBUIÇÃO:
    Comando vs Operador:
      = comando de atribuição
      == operador lógico de igualdade

PERGUNTAR SOBRE O QUE É PARA SER DESCARTADO
  

FUNÇÕES

  function type name(type arg1, type arg2){

  };

  FUNÇÃO PRINCIPAL
  init {

  }
*/
}

// 1--1 erro 1- -1 = 2 1-1=0

comeco {
  int variavel = 1 + 2;
}

compilado.c
int main(int args) {
  int variavel = 1+2;
  return 0;
}
