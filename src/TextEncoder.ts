export default class TextEncoder {
  #canvas: HTMLCanvasElement = document.createElement("canvas");
  #ctx: CanvasRenderingContext2D = this.#canvas.getContext("2d")!;

  constructor() {
    this.#clear();
  }

  #clear() {
    this.#canvas = document.createElement("canvas");
    const ctx = this.#canvas.getContext("2d");
    if (!ctx) {
      throw new Error();
    }
    this.#ctx = ctx;
    this.#ctx.imageSmoothingEnabled = false;
  }

  encode(data: string, callback: (blob: Blob) => void): void {
    this.#clear();

    const size = Math.ceil(Math.sqrt(data.length / 3));
    this.#canvas.height = size;
    this.#canvas.width = size;

    for (let i = 0; i < data.length; i += 3) {
      let alpha = 0;

      const values = new Array(3).fill(null).map((x, j) => {
        if (data[i + j]) alpha += 1 / 3;
        return (data[i + j] ?? " ").charCodeAt(0);
      });

      const imageData = new ImageData(
        new Uint8ClampedArray([...values, alpha * 255]),
        1,
        1
      );

      console.log(imageData);

      // const rgba = `rgb(${values.join(",")}, ${1})`;
      // console.log(rgba);
      // this.#ctx.fillStyle = rgba;

      const x = (i / 3) % size;
      const y = Math.trunc(i / 3 / size);

      //this.#ctx.fillRect(x, y, 1, 1);
      this.#ctx.putImageData(imageData, x, y);
    }

    this.#canvas.toBlob((blob: Blob | null): void => {
      if (!blob) {
        blob = new Blob();
      }

      blob.arguments = callback(blob);
    }, "image/webp");
  }

  decode(blob: Blob, callback: (output: string) => void): void {
    this.#clear();

    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const height = img.height;
      const width = img.width;
      this.#canvas.height = height;
      this.#canvas.width = width;
      this.#ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const data = "";

      for (let i = 0; i < height * width; i++) {
        const x = (i / 3) % width;
        const y = Math.trunc(i / 3 / height);

        const { data } = this.#ctx.getImageData(x, y, x + 1, y + 1);

        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${
          data[3] / 255
        })`;

        console.log(rgba);
      }
    };
    img.src = url;
  }
}
