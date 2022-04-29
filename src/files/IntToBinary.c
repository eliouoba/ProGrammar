void display_binary_n(int dec) {
    const int size = sizeof(int) * 8;
    unsigned int current;
    int i; 
    for( i = size - 1 ; i >= 0 ; i--) {
        current = 1<<i;
        printf("%d",((current & dec) != 0)  ? 1:0);
    }
}