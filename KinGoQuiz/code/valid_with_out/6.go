package main

import "fmt"

func main() {
	var A bool = true
	var B bool = true
	var C bool = true
	var D bool = true
	var E bool = true
	var F bool = true
	var G bool = true
	var H bool = true
	// var I bool = false
	// var J bool = false
	// var K bool = false
    if A && (B || !C && D && (E || (F && G || H))) {
		fmt.Println(A)
	} else {
		fmt.Println(B)
	}
}
