#include <stdio.h>

int main()
{
  FILE *pFile;
  pFile = fopen("file.naw", "r");

  char test[100];

  test[0] = fgetc(pFile);
  test[0] = fgetc(pFile);
  test[0] = fgetc(pFile);
  printf("%c", test[0]);

  return 0;
}