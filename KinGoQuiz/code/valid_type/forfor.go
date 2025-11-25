// PARCOURIR UNE MAP EN 2D
carte := [][]int

for x := 0; x < len(carte); x++ {

    for y := 0; y < len(carte[x]); y++ {

        fmt.Printf("%d\n", carte[x][y])
    }
}