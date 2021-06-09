"use strict";

const fonts = [
    "Calibri",
    "Times New Roman",
    "Consolas",
    "Roboto",
    "Arial",
    "Century Gothic",
    "Segoe UI",
];

const formats = ["png", "jpeg", "ico", "tiff", "gif"];

// "form" items
const text = document.getElementById("text");
const background = document.getElementById("background");
const foreground = document.getElementById("foreground");
const font = document.getElementById("font");
const bold = document.getElementById("bold");
const italic = document.getElementById("italic");
const format = document.getElementById("format");

const create = document.getElementById("create");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

fonts.forEach((f) => {
    const elem = document.createElement("option");
    elem.value = f;
    elem.textContent = f;

    font.appendChild(elem);
});
{
    const e = document.createElement("option");
    e.disabled = true;
    e.text = "Add more by sending me a PR!";

    font.appendChild(e);
}

formats.forEach((f) => {
    const elem = document.createElement("option");
    elem.value = f;
    elem.textContent = f.toUpperCase();

    format.appendChild(elem);
});

changeListener();
text.addEventListener("keyup", changeListener);
[background, foreground, font, bold, italic].forEach((e) =>
    e.addEventListener("change", changeListener, { passive: true })
);

text.addEventListener("keyup", () => {
    if (text.value.length > 3) {
        text.value = text.value.slice(0, 3);
    }
});

create.addEventListener(
    "click",
    () => {
        const link = document.createElement("a");
        link.download = `icon.${format.value}`;
        link.href = canvas.toDataURL(`image/${format.value}`);
        link.click();
    },
    { passive: true }
);

/**
 * Updates the canvas based on the current state of the inputs.
 */
function changeListener() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = background.value;
    ctx.beginPath();
    roundRect(ctx, 0, 0, canvas.width, canvas.height, 150, true, false);
    ctx.stroke();

    ctx.fillStyle = foreground.value;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${bold.checked ? "bold" : ""} ${
        italic.checked ? "italic" : ""
    } 400px ${font.value}`;
    ctx.fontWeight = "bold";
    ctx.fillText(text.value, canvas.width / 2, canvas.height / 2);
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @see [This SO Thread](https://stackoverflow.com/a/3368118/14538775)
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius = 5,
    fill = false,
    stroke = true
) {
    if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius.br,
        y + height
    );
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}
