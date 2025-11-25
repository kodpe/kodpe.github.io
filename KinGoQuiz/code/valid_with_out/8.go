package main

import "fmt"

func main() {
	a := true
	b := false

    if a && (b != a) {
		fmt.Println(a)
    } else {
		fmt.Println(a)
	}
}
