int factors(int x) {
    int div = 2;
    int i = 0, j = 0;
    int num = x;
    int * prime = (int * ) malloc(x * sizeof(int));
    getch();
    if (x == 1 || x == 0) {
        printf("Number %d has no prime Factors", x);
        * prime = 0;
    } else {
        while (x > 1) {
            if ((x % div) == 0) {
                *(prime + i) = div;
                x = x / div;
                i++;
            } else {
                div++;
            }
        }
    }
    printf("\n The Prime Factors for Number %d are  :\n", num);
    for (j = 0; j < i; j++) {
        printf(" %d ", *(prime + j));
    }
    return (0);
}