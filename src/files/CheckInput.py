def isNumber(s):

    for i in range(len(s)):
        if s[i].isdigit() != True:
            return False
    return True

if __name__ == "__main__":
    str = "6790"
    if isNumber(str):
        print("Integer")
    else:
        print("String")