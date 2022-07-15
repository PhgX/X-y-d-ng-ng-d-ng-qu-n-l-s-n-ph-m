const fs = require("fs");
const http = require("http");
const qs = require("qs");
const url = require("url");

let productList = [];
let html = "";

const server = http.createServer((req, res) => {
  let parseUrl = url.parse(req.url, true);
  let path = parseUrl.pathname;
  let trimPath = path.replace(/^\/+|\/+$/g, "");
  switch (trimPath) {
    case "create": {
      fs.readFile("product.json", "utf-8", (err, data) => {
        let parseData;
        parseData = JSON.parse(data);
        if (parseData) {
          parseData.forEach((value) => {
            html += `<tr>
            <td>${value.id}</td>
            <td>${value.name}</td>
            <td>${value.price}</td>
            <td><button class="btn btn-danger">Delete</button></td>
            <td><button class="btn btn-primary">Update</button></td>
          </tr>`;
          });
        }
      });
      fs.readFile("./views/index.html", "utf-8", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        data = data.replace("{list-product}", html);
        res.write(data);
        return res.end();
      });
      break;
    }
  }

  if (req.method === "GET") {
    fs.readFile("./views/index.html", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      }
    });
  } else {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let parseDataToObject;
      parseDataToObject = qs.parse(data);
      parseDataToObject.id = productList.length + 1;
      productList.push(parseDataToObject);

      fs.writeFile("product.json", JSON.stringify(productList), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Saved data success");
        }
      });
    });
  }
});

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});
