public Iterator<String> anonIterator() {
    Iterator<String> iterator = new Iterator<String>() {
        int count = 0;
      
        public boolean hasNext() {
            return (count < titleList.size());
        }

        public String next() {
            return titleList.get(count++);
        }
    };
    return iterator;
}