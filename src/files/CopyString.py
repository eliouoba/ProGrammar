def copy_str(x,y):
    if len(y)==0:
        return x
    else:
        c = copy_str(x,(y)[1:-1])
        return c
x = input()
y = input()
print(copy_str(x,y))