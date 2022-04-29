#include <bits/stdc++.h>
using namespace std;

int round(int n)
{
	int a = (n / 10) * 10;
	int b = a + 10;	
	return (n - a > b - n)? b : a;
}

int main()
{
	int n = 4722;
	cout << round(n) << endl;
	return 0;
}