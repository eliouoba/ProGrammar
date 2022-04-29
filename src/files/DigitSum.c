long int Sum_of_Dig(long int Number) {
    static long int sum=0;
    if (Number==0) {
        return(sum);
    } else {
        sum=sum+Number%10+Sum_of_Dig(Number/10);
    }
    return(sum);
}