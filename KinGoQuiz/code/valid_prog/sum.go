package main

import"fmt"

func main(){
  var s string
  fmt.Scanf("%s",&s)

  sum := 0
  for i := 0; i < len(s); i++ {
    sum += int(s[i])
  }
  fmt.Printf("%d", sum)
}