// // Convertir le PDF en images
// const pdf2pic = require('pdf2pic');

// const converter = new pdf2pic();


// converter.convertBulk('pdf/LIBEGMAP1.pdf', {format: 'png'}).then((images) => {
//     images.forEach((image, index) => {
//         fs.writeFileSync(`png/image_${index}.png`, image);
//     });
// }).catch((err) => {
//     console.error(err);
// });


const { fromPath } = require("pdf2pic");

const options = {
  density: 100,
  saveFilename: "untitled",
  savePath: "./png",
  format: "png",
  width: 600,
  height: 600
};
const convert = fromPath("/pdf/LIBEGMAP1.pdf", options);
const pageToConvertAsImage = 1;

convert(pageToConvertAsImage, { responseType: "image" })
  .then((resolve) => {
    console.log("Page 1 is now converted as image");

    return resolve;
  });




