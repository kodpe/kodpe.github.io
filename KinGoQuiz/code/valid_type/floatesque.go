var s string = "test"
for i := 0; i < len(s) - len(s) + len(s); i++ {
    fmt.Printf("%c", s[i])
}
