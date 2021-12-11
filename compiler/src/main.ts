/* eslint-disable no-console */
import { FileHandler } from './fileHandler';
import { Scanner } from './scanner';
import * as readline from 'readline';

const scanner = new Scanner();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Qual o caminho do arquivo? ', function(path) {
  console.info();
  console.info();
  console.info();
  const file = new FileHandler(
    (line, lineCount) => scanner.processLine(line, lineCount),
    path,
  );

  file.readLineByLine();

  rl.close();
});
