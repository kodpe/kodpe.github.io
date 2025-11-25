package main

import "fmt"

func main() {
	r := "Koala"
	for i := 0; i < len(r); i++ {
		k := r[i]
		fmt.Printf("%c", k)
	}
}
