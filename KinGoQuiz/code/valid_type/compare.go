package main

import "fmt"

func main() {
    var a int = 5
    var b bool = true

    if b {
        a += 1
    }

    fmt.Println(a)
}
