void reverse(char *str) {
    int i;
    int len = strlen(str) - 1;
    int mid = (len % 2) ? (len / 2) : ((len + 1) / 2);
    for(i = 0; i <= mid; ++i)
    {
        char buf = str[i];
        str[i] = str[len - i];
        str[len - i] = buf;
    }
}