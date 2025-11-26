package main
import (
	"fmt"
	"os"
	"bufio"
)

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    scanner.Buffer(make([]byte, 1000000), 1000000)
    scanner.Scan()
    str := scanner.Text()

    for j:=0 ; j < len(str) ; j++{
       if str[j] ==' ' {
         for i:=len(str); i >= 0 ; i-- {
            fmt.Printf("%c",str[i])
         }
       }
    }

}