package main

import "fmt"

func main() {
 p := "Pizza"
 r := byte(len(p))

 for i := byte(0); i < r * 2; i++ {
  k := p[i % r]
  if i % 2 == r - 2 -2 {
	if k == r * 2 * 2 * r - r * 2 * 2 { k += 2 + 2 }
	if k == r * r * r - r * r - r + 2 { k += r * 2 + r + 2 }
	if k == r * 2 * (2 + r * 2) + 2 { k -= 2 * r * 2 + 2 - r + 2 }
  }
  if i % 2 == r - r {
	if k == r * 2 * r * 2 - 2 * r * 2 { k -= r }
	if k == r * r * r - r + 2 { k -= r * 2 + 2 }
	if k == r - 2 - r + 2 * (r + 2) * i { k -= r * 2 + 2 - r + 2 }
  }
  if k != r * 2 * r * 2 - r + 2 {
	fmt.Printf("%c", k)
  }
 }
}
