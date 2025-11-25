package main
import "fmt"
func z(a int, b int, c int)int{
    return a+b+b+b+b+c
}
func main(){
    fmt.Println("1+2+2+2+2+3 =",z(1,2,3))
}