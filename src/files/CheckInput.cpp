#include <iostream>
using namespace std;

bool isNumber(string s)
{
	for (int i = 0; i < s.length(); i++)
		if (isdigit(s[i]) == false)
			return false;
	return true;
}

int main()
{
	string str = "6790";
	if (isNumber(str))
		cout << "Integer";
	else
		cout << "String";
}