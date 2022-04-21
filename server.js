const http = require("http");
const fs = require("./utils/FS");

const { read, write } = fs;

const server = http.createServer((req, res) => {
  const method = req.method;
  const route = req.url.split("/")[1];
  const id = req.url.split("/")[2];
  const dataMarket = read("markets.json");
  const dataBranches = read("branches.json");
  const dataProduct = read("products.json");
  const dataWorkes = read("workes.json");

  const options = {
    "Content-Type": "application/json",
  };

  if (method == "GET") {
    if (route == "products") {
      const products = dataProduct.find((e) => (id ? e.id == id : e));

      res.writeHead(200, options);
      res.end(JSON.stringify(products));
      return "ok";
    }

    if (route == "workes") {
      const workes = dataWorkes.filter((e) => (id ? e.id == id : e));

      res.writeHead(200, options);
      res.end(JSON.stringify(workes));
    }

    if (route == "branches" && id) {
      const brenches = dataBranches.filter((e) => {
        if (e.id == id) {
          e.products = dataProduct.filter((p) => p.branch_id == e.id);
          e.wokers = dataWorkes.filter((w) => w.branch_id == e.id);
          return e;
        }
      });

      res.writeHead(200, options);
      res.end(JSON.stringify(brenches));
      return 'ok'
    }

    if (route == "branches") {
      const branch = dataWorkes.filter((e) => e.id == id);

      res.writeHead(200, options)
      res.end(JSON.stringify(branch));
    }

    if (route == "market" && id) {
      const market = dataMarket.filter((e) => {
        if (e.id == id) {
          e.brenches = dataBranches.filter((b) => {
           if(e.id == b.id){
            b.products = dataProduct.filter((p) => p.branch_id == b.id);
            b.wokers = dataWorkes.filter((w) => w.branch_id == b.id);
            return b;
           }
          });
          return e;
        }
      });
      res.writeHead(200, options);
      res.end(JSON.stringify(market));
      return 'ok'
    }

    if(route == "market"){
      const market = dataMarket.filter((e) => {
          e.brenches = dataBranches.filter((b) => {
            b.products = dataProduct.filter((p) => p.branch_id == b.id);
            b.wokers = dataWorkes.filter((w) => w.branch_id == b.id);
            return b;
          });
          return e;
      });
      res.writeHead(200, options);
      res.end(JSON.stringify(market));
    }
    if(route != "worker" && route != "branches" && route != "market"){
      res.writeHead(404, options);
    res.end("Page not found");
    }
  } 

  if (method == "POST") {

    if (route == "branches" ) {
      req.on("data", (chunk) => {
        const { name, address, market_id } = JSON.parse(chunk);

        dataBranches.push({ id: dataBranches.length + 1, name, address, market_id });
        write("branches.json", dataBranches);
        console.log(name, address, market_id );
       
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end("OK");
      });
    }

    if (route == "products") {
      req.on("data", (chunk) => {
        const { name, price, count } = JSON.parse(chunk);

        dataProduct.push({ id: dataProduct.length + 1, name, price, count });
        write("products.json", dataProduct);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end("OK");
      });
    }

    if (route == "workes") {
      req.on("data", (chunk) => {
        const { name, position } = JSON.parse(chunk);

        dataWorkes.push({ id: dataWorkes.length + 1, branch_id: dataWorkes.length + 1, name, position });
        write("workes.json", dataWorkes);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end("OK");
      });
    }
  }

  if (method == "PUT") {
    if (route == "branches" && id) {
      req.on("data", (chunk) => {
        const { name, address, market_id } = JSON.parse(chunk);

        const breanch = dataBranches.find((e) => e.id == id);

        if(breanch){
          breanch.name = name ||  breanch.name
          breanch.address = address || breanch.address
          breanch.market_id = market_id|| breanch.market_id
        }

        write("branches.json", dataBranches);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end("OK");
      });
    }
    if (route == "products" && id) {
      req.on("data", (chunk) => {
        const { name, price, count } = JSON.parse(chunk);

        const products = dataProduct.find((e) => e.id == id);

      console.log(products );
        if(products){
          products.name = name ||  products.name
          products.price = price || products.price
          products.count = count || products.count
        }

        write("products.json", dataProduct);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end("OK");
      });
    }
    if (route == "workes" && id) {
      req.on("data", (chunk) => {
        const { name, position, branch_id } = JSON.parse(chunk);

        const workes = dataWorkes.find((e) => e.id == id);

        if(workes){
          workes.name = name ||  workes.name
          workes.address = position || workes.position
          workes.branch_id = branch_id|| workes.branch_id
        }

        write("workes.json", dataWorkes);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end("OK");
      });
    }
  }

  if (method == "DELETE") {
    if (route == "branches") {
      req.on('data', chunk => {
        const { market_id } = JSON.parse(chunk)

        const index = dataBranches.findIndex(e => e.market_id == market_id)
        dataBranches.splice(index, 1)

        write('branches.json', dataBranches)

        res.writeHead(200, options)
        res.end(JSON.stringify("OK"))
    })
    }

    if (route == "products") {
      req.on('data', chunk => {
        const { branch_id } = JSON.parse(chunk)

        const index = dataProduct.findIndex(e => e.branch_id == branch_id)
        console.log(index);
        dataProduct.splice(index, 1)

        write('products.json', dataProduct)

        res.writeHead(200, options)
        res.end(JSON.stringify("OK"))
    })
    }

    if (route == "workes") {
      req.on('data', chunk => {
        const { branch_id } = JSON.parse(chunk)

        const index = dataWorkes.findIndex(e => e.branch_id == branch_id)
        dataWorkes.splice(index, 1)

        write('workes.json', dataWorkes)

        res.writeHead(200, options)
        res.end(JSON.stringify("OK"))
    })
    }
  }
});

server.listen(9000, console.log("runing port", 9000));
