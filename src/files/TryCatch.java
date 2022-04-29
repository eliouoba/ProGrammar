private Exception test() {
    Exception e = new Exception();
    try {
        Thread.sleep(50);
    } catch (Exception ex) {
        e = ex;
    }
    e.printStackTrace();
    return e;
}