/* eslint-disable no-console */
import { AnalisadorLexico } from './analisadorLexico';
import { AnalisadorSintatico } from './analisadorSintatico';

const lexico = new AnalisadorLexico(process.argv[2]);

const AS = new AnalisadorSintatico(lexico);

AS.S();
