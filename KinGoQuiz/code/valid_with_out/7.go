package main

import "fmt"

func main() {
	a := true
	b := false
	c := true

    if a && b && c {
		fmt.Println(c)

    } else if a && (b || c) {
		fmt.Println(b)

    } else {
		fmt.Println(a)
	}
}
