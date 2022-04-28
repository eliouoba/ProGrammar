#include <stdio.h>
int main(){
    printf("0, 1, 2, 3, 4, 5, 6, 7, 8, 9,\n");
    int i = 0;
    do {
        printf("%d, ", i);
        i++;
    } while (i < 10);
    return 0;
}