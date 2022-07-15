const fs = require("fs");
const http = require("http");
const qs = require("qs");

let parseData;
let html = "";

let server = http.createServer((req, res) => {
  if (req.method === "GET") {
    fs.readFile("./views/index.html", (err, data) => {
      if (err) {
        return err.message;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  } else {
    fs.readFile("product.json", "utf-8", (err, data) => {
      parseData = JSON.parse(data);
      if (parseData) {
        parseData.forEach((value, index) => {
          html += `<tr>
          <td>${index + 1}</td>
          <td>${value.name}</td>
          <td>${value.price}</td>
          <td><button class="btn btn-danger">Delete</button></td>
          <td><button class="btn btn-primary">Update</button></td>
          </tr>`;
        });
      }
    });
    
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let parsedData = qs.parse(data);
      parsedData.id = parseData.length;
      parseData.push(parsedData);
      let addNewProduct = JSON.stringify(parseData);

      fs.writeFile("product.json", addNewProduct, (err) => {
        if (err) {
          console.log(err.message);
          return res.end();
        } else {
          console.log("Product saved success");
          return res.end();
        }
      });
    });
  }

  fs.readFile("./views/index.html", "utf-8", (err, data) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    data = data.replace("{list-product}", html);
    res.write(data);
    return res.end();
  });
});

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});
