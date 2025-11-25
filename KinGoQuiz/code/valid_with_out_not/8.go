package main

import "fmt"

func main() {
	a := true
	b := false

    if a && (b != a) {
		fmt.Println(b)
    } else {
		fmt.Println(a)
	}
}
