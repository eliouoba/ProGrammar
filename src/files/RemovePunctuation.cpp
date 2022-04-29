#include <iostream>
using namespace std;

int main()
{
    std::string str = "Welcome???@@##$ to#$% ProGrammar";
    for (int i = 0, len = str.size(); i < len; i++)
    {     
        if (ispunct(str[i]))
        {
            str.erase(i--, 1);
            len = str.size();
        }
    }
    std::cout << str;
    return 0;
}