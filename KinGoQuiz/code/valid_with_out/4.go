package main

import "fmt"

func main() {

	for i := 0; i < 4; i++ {

		if i % 2 != 0 {
    		fmt.Print(i + 1)

		} else {
    		fmt.Print(i - 1)
		}
	}
}
