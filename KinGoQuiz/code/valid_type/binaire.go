func main() {
    var N int
    var r []int
    fmt.Scanln(&N)

    Nk := N
    for Nk > 0 {
    Rk := Nk % 2
    Nk = Nk / 2
    r = append(r, Rk)
    }
    for i := len(r) - 1; i >= 0; i-- { 
        fmt.Println(r[i])
    }
} 