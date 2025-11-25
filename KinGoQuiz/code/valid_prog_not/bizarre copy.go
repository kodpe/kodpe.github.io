package main
import "fmt"
func main(a int, b int, c int)int{
    return a+b+b+b+b+c
}
func main(){
    fmt.Println("1+2+2+2+2+3 =",main(1,2,3))
}