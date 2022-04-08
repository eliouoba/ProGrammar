#include <stdio.h>
int main(){
    char example[] = "This is a string,";
    char example2[] = " and this is another string!";
    char concatenation[] = example + example2;
    printf("%s These strings are now concatenated!", concatenation);
    return 0;
}