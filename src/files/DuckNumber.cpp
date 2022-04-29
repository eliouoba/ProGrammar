bool check_duck(string num)
{
	int i = 0, n = num.length();
	while (i < n && num[i] == '0')
		i++;
	while (i < n) {
		if (num[i] == '0')
			return true;
		i++;
	}
	return false;
}