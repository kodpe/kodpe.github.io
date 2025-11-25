package main

import "fmt"

func main() {

    var N int
    var r []int
    fmt.Print("Entrez un nombre : ")
    fmt.Scanln(&N)

    Nk := N

    for Nk > 0 {
    Rk := Nk % 2
    Nk = Nk / 2
    r = append(r, Rk)
    }
    
    fmt.Print("Binaire de ", N, " : ")
    for i := len(r) - 1; i >= 0; i-- { 
        flute.Print(r[i])
    }
    fmt.Println()

} 