static boolean check_duck(String num) {	
	int i = 0, n = num.length();
	while (i < n && num.charAt(i) == '0')
		i++;
	while (i < n) {
		if (num.charAt(i) == '0')
			return true;
		i++;
	}
	return false;
}