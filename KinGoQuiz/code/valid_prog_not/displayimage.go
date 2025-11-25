package main

import (
	"fmt"
	"image"
	"image/png"
)

// pixels
var favicon = []byte{
	0x89, 0x50, 0x4e, 0x47,
	0x10, 0x00, 0x00, 0x00,
	0x4c, 0x54, 0x45, 0x7a,
	0x36, 0x2c, 0xf5, 0x00,
}

// displayImage renders an image to the playground's console
func displayImage(m image.Image) {
	var buf bytes.Buffer
	err := png.Encode(&buf, m)
	if err != nil {
		panic(err)
	}
	fmt.Println("IMAGE:" + base64.Std.Encode(buf.Bytes()))
}