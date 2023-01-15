const axios = require("axios");
const endpoint = 'https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic';
const endpointSVG = 'https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-svg';
const ABI = require("./aavegotchi_abi.json");

exports.fetchGotchisByWallet = async function (address, limit, skip) {
   const query = `
       {
          aavegotchis(
            first: ${limit}
            where: {owner: "${address.toLowerCase()}", status: 3}
            skip: ${skip}
          ) {
            gotchiId
            owner
            name
            modifiedNumericTraits
            modifiedRarityScore
            level
            kinship
            }
        }`;
   
   const data = await axios.post(endpoint, {query: query});
   
   return data.data.data;
}

exports.fetchGotchiSVGByGotchiIDs = async function (ids) {
   const query = `
       {
          aavegotchis(where: {id_in: ${JSON.stringify(ids)}}) {
            id
            svg
            left
            right
            back
          }
        }`;
   
   const data = await axios.post(endpointSVG, {query: query});
   
   return data.data.data;
}

exports.fetchGotchiByGotchiIDs = async function (address, id) {
   const query = `
       {
          aavegotchis(
            first: ${id.length}
            where: {owner: "${address.toLowerCase()}", gotchiId_in:${JSON.stringify(id)} , status: 3}
          ) {
            gotchiId
            owner
            name
            modifiedNumericTraits
            modifiedRarityScore
            level
            kinship
            }
        }`;
   
   const data = await axios.post(endpoint, {query: query});
   
   return {"info":data.data.data, "svg": data.data.data?(await exports.fetchGotchiSVGByGotchiIDs(id)):[]};
}