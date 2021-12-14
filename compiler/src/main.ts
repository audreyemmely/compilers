/* eslint-disable no-console */
import { FileHandler } from './fileHandler';
import { Scanner } from './scanner';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Qual o caminho do arquivo? ', function(path) {
  console.info();
  console.info();
  console.info();

  const scanner = new Scanner();

  path = './programas/helloWorld.anw';
  // path = './programas/shellSort.anw';
  // path = './programas/fibonacci.anw';

  const file = new FileHandler(
    (line, lineCount) => scanner.processLine(line, lineCount),
    path,
  );

  file.readLineByLine();

  rl.close();
});
