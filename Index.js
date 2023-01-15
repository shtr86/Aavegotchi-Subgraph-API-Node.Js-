const http = require('http');
const url = require('url');

var aavegotchi = require('./aavegotchi.js');

const server = http.createServer();
server.on('request', async (req, res) => {
    var data = "";
    var queryError = false;
    
    try {
      var queryData = url.parse(req.url, true).query;
      
      if (queryData.req) {
          switch (queryData.req) {
              case "gotchibyid": {
                  if (queryData.address && queryData.id) {
                    data = await aavegotchi.fetchGotchiByGotchiIDs(queryData.address, queryData.id.split(","));
                  } else {
                      queryError = true;
                  }
                  break;
              }
              case "gotchisvgbyid": {
                  if (queryData.id) {
                    data = await aavegotchi.fetchGotchiSVGByGotchiIDs(queryData.id.split(","));
                  } else {
                      queryError = true;
                  }
                  break;
              }
              case "gotchibywallet":
                  if (queryData.address) {
                    data = await aavegotchi.fetchGotchisByWallet(queryData.address, 5, 0);
                    
                    var ids = [];
                    
                    if (data.aavegotchis) {
                        data.aavegotchis.forEach(gotchi => {
                          ids.push(gotchi.gotchiId)
                        });
                    }
                    
                    data = {"info":data, "svg": (ids.length>0)?(await aavegotchi.fetchGotchiSVGByGotchiIDs(ids)):[]};
                      
                  } else {
                      queryError = true;
                  }
                break;
              default:
                queryError = true;
                break;
        }
          
      } else {
          queryError = true;
      }
      
      if (!queryError)  {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end("query_error");
      }
    }
    catch(err) {
      res.writeHead(400, {'Content-Type': 'text/plain'});
     res.end("error: " + err);
    }
});
