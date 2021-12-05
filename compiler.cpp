#include <bits/stdc++.h>
using namespace std;

struct TOKEN
{
  char value[1000];
};

int main()
{
  FILE *pFile;
  pFile = fopen("file.naw", "r");

  char teste;

  FILE *pFile2 = pFile;

  printf("%c", fgetc(pFile2));
  printf("%c", fgetc(pFile));

  getchar();
  fclose(pFile);
  return 0;
}