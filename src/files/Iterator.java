public class myIterator implements Iterator<Integer> {
    int[] arr;
    int index;
    
    myIterator(int[] arr) {
        this.arr = arr;
        index = 0;
    }
    
    public boolean hasNext() {
        return index < arr.length;
    }

    public int next() {
        return arr[index++];
    }
}