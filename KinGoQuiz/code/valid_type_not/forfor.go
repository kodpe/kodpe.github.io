// PARCOURIR UNE MAP EN 2D
for x := 0; x < len(map); x++ {

    for y := 0; y < len(map[x]); y++ {

        fmt.Printf("%d\n", string(map[x][y]))
    }
}