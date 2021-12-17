/* eslint-disable no-console */
import { FileHandler } from './fileHandler';
import { Scanner } from './scanner';

const scanner = new Scanner();

const file = new FileHandler(
  (line, lineCount) => scanner.processLine(line, lineCount),
  process.argv[2],
);

// path = './programas/helloWorld.anw';
// path = './programas/shellSort.anw';
// path = './programas/fibonacci.anw';

file.readLineByLine();

// console.info('process');
// console.info(process.argv);
