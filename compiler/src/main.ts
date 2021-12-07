/* eslint-disable no-console */
import { FileHandler } from './fileHandler';
import { Scanner } from './scanner';

const scanner = new Scanner();

const file = new FileHandler(
  (line, lineCount) => scanner.processLine(line, lineCount),
  './programas/helloWorld.anw',
);

file.readLineByLine();
