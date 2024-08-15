#!/usr/bin/env python

import random

coin = [ 1, 2, 3 ,4 ,5 ,6 ,7 ,8 , 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58 , 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, ]

def main():
    r1 = random.SystemRandom()
    
    n = 1
    
    n1 = 0
    n2 = 0
    
  while x < 1000:
    
    while n < 100:
      c1 = r1.choice(coin)

      if c1 == 1: 
        n1 += 1

      if c1 == 2:
        n2 += 1
              
      n += 1

    print("Number of times 1 was selected: %d" % (n1))
    print("Number of times 2 was selected: %d" % (n2))
    print("Number of times 3 was selected: %d" % (n3))
 

    
 #   print("Ratio: %d" % (h / t))
       
if __name__ == "__main__":
    main()
    
print('Hello, ' + os.getlogin() + '! How are you?')

	print("Number of times 1 was selected: %d" % (n1))