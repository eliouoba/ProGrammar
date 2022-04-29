def allCharactersSame(s) :
	n = len(s)
	for i in range(1, n) :
		if s[i] != s[0] :
			return False
	return True

if __name__ == "__main__" :
	s = "aaa"
	if allCharactersSame(s) :
		print("Yes")
	else :
		print("No")