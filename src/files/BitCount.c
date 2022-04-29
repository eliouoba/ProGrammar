#include <stdio.h>
 
int count(unsigned int x) {
    int n = 0;
    while (x > 0)
    {
        x = x&(x-1);
        n = n + 1;
    }
    return n;
}