package main

import "fmt"

func main() {

	s := 0

	for i := 3; i > 0; i-- {
		s += i * 10
	}

    fmt.Println(s)
}
