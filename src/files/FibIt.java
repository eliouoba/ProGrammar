public int fibonacci(int n) {
    int firstTerm = 0, secondTerm = 1;
    for (int i = 1; i <= n; ++i) {
        System.out.print(firstTerm + ", ");
        int nextTerm = firstTerm + secondTerm;
        firstTerm = secondTerm;
        secondTerm = nextTerm;
    }
}