static void printInitials(String name) {
	if (name.length() == 0)
		return;
	System.out.print(Character.toUpperCase(name.charAt(0)));
	for (int i = 1; i < name.length() - 1; i++)
		if (name.charAt(i) == ' ')
			System.out.print(" " + Character.toUpperCase(name.charAt(i + 1)));
}

public static void main(String args[]) {
	String name = "John Doe";
	printInitials(name);
}