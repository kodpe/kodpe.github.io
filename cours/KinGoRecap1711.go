/*
	KinGoRecap 17-11-25
	Fonctions, Arguments, Returns, Pointeurs, Bool, Modulo, variables locales et globales

	Pour compiler :
	> go build KinGoRecap1711.go

	Pour compiler et executer en meme temps:
	> go run KinGoRecap1711.go
*/
package main
import "fmt"

// function avec un argument et un return
func addOne(argument int) int {
	result := argument + 1
	return result
}

// function sans argument ni return (par exemple une fonction d'affichage)
func hello() {
	fmt.Printf("Hello World\n")
}

// function avec 4 arguments et 2 returns
func compute(arg1 int, arg2 int, arg3 int , arg4 int) (int, int) {
	r12 := arg1 + arg2
	r34 := arg3 + arg4
	return r12, r34
}

// function avec usage de pointeurs (par exemple pour eviter un double return)
func swap(a *int, b *int) {
	temp := *a
	*a = *b
	*b = temp
	fmt.Printf("adresse a : %p\n", a)
	fmt.Printf("adresse b : %p\n", b)
}

// function pour verifier si un nombre est pair grace au modulo '%'
func isEvenA(number int) bool {
	if number % 2 == 0 {
		return true
	} else { // sinon number % 2 == 1
		return false
	}
}

// meme function ecrite de maniere plus concise
func isEvenB(n int) bool {
	return n % 2 == 0
}

var score int = 0 // exemple de variable globale (visible par toutes les fonctions)
func addTwo() {
	var two int = 2 // exemple variable locale (visible seulement dans cette fonction)
	score += two
}

// main de test
func main(){
	fmt.Printf("TEST 1 addOne()\n")
	fmt.Printf("addOne(1) -> %d\n", addOne(1))
	fmt.Printf("\n")

	fmt.Printf("TEST 2 hello()\n")
	fmt.Printf("hello() -> ")
	hello()
	fmt.Printf("\n")

	fmt.Printf("TEST 3 compute()\n")
	x, y := compute(1, 2, 3, 4)
	fmt.Printf("compute(1, 2, 3, 4) -> %d, %d\n", x, y)
	fmt.Printf("\n")

	fmt.Printf("TEST 4 swap()\n")
	i := 1
	k := 42
	fmt.Printf("adresse i : %p\n", &i)
	fmt.Printf("adresse k : %p\n", &k)
	fmt.Printf("valeur i  : %d\n", i)
	fmt.Printf("valeur k  : %d\n", k)
	fmt.Printf("swap(&i, &k)\n")
	swap(&i, &k)
	fmt.Printf("valeur i  : %d\n", i)
	fmt.Printf("valeur k  : %d\n", k)
	fmt.Printf("\n")

	fmt.Printf("TEST 5 isEvenA()\n")
	fmt.Printf("isEvenA(42) -> %t\n", isEvenA(42))
	fmt.Printf("isEvenA(43) -> %t\n", isEvenA(43))
	fmt.Printf("\n")

	fmt.Printf("TEST 6 isEvenB()\n")
	fmt.Printf("isEvenB(8) -> %t\n", isEvenB(8))
	fmt.Printf("isEvenB(15) -> %t\n", isEvenB(15))
	fmt.Printf("\n")

	fmt.Printf("TEST 7 addTwo()\n")
	fmt.Printf("score  : %d\n", score)
	fmt.Printf("addTwo()\n")
	addTwo()
	fmt.Printf("score  : %d\n", score)
	fmt.Printf("\n")
}