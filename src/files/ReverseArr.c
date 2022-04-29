int* ReverseArray(int* orig, unsigned short int b) {
    unsigned short int a=0;
    int temp;
     
    for(a;a<--b;a++) {
        temp=orig[a];
        orig[a]=orig[b];
        orig[b]=temp;
    }
    return orig;
}