import TextEncoder from "./TextEncoder";

const encoder = new TextEncoder();

const input = document.querySelector<HTMLTextAreaElement>("#in")!;
const output = document.querySelector<HTMLTextAreaElement>("#out")!;

input.onkeydown = () => {
  setTimeout(() => {
    update();
  }, Infinity);
};

function update() {
  encoder.encode(input.value ?? " ", (blob: Blob): void => {
    const newImg = document.createElement("img");
    const url = URL.createObjectURL(blob);

    newImg.onload = () => {
      // URL.revokeObjectURL(url);
    };

    newImg.src = url;
    const element = document.querySelector<HTMLDivElement>("#display");
    element!.innerHTML = "";
    element?.appendChild(newImg);

    encoder.decode(blob, (content) => {
      output.innerText = content;
    });
  });
}

update();
