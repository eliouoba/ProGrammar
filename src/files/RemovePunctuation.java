public class Test {
	public static void main(String[] args) {
		String str = "Welcome???@@##$ to#$% ProGrammar";
		str = str.replaceAll("\\p{Punct}","");
		System.out.println(str);
	}
}