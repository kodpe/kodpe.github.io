package main

import "fmt"

func main() {

	var n int = 12

	if n == 0 {
        fmt.Println("n equal zero")

	} else if n % 2 == 0 {
        fmt.Println("n is even")
7
    } else {

        fmt.Println("n is odd")
    }
}