package main

import "fmt"

func main() {

	for i := 'a'; i <= 'z'; i++ {

		if i % 2 == 1 {
    		fmt.Printf(" %c ", i)
		}
	}
    fmt.Printf("\n")

	for i := 'a'; i <= 'z'; i++ {

		if i % 2 == 0 {
    		fmt.Printf(" %c ", i)
		}
	}
    fmt.Printf("\n")
}
