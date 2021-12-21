/* eslint-disable no-console */
import { AnalisadorLexico } from './analisadorLexico';

const lexico = new AnalisadorLexico(process.argv[2]);

while (true) {
  const token = lexico.nextToken();

  if (!token) break;
}
