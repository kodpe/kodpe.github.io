package main

import "fmt"

func main() {

	for i := 97; i <= 122; i++ {

		if i % 2 == 1 {
    		fmt.Printf("%c ", i)
		}
	}
    fmt.Printf("\n")

	for i := 97; i <= 122; i++ {

		if i % 2 == 0 {
    		fmt.Printf(" %c", i)
		}
	}
    fmt.Printf("\n")
}
