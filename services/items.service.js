const boom = require('@hapi/boom');
const request = require("request");
var host = 'https://api.mercadolibre.com/';

class ItemsService {

    constructor(){
        this.author = [];
        this.items = [];
        this.categories = [];
        this.data =  [];
    }

    addAuthorToData() {
        this.author =[]
        this.author= {
            "name": 'Yordy',
            "lastname": 'Riascos',
        };
        this.data.push({['author']: this.author});
    }

    addItemsToData(items) {
        this.items = [];
        items.forEach(item => {
            this.items.push({
                "id": item.id,
                "title": item.title,
                "price": {
                "currency": item.currency_id,
                "amount": item.price,
                "decimals": item.price.toFixed(3)
                },
                "picture": item.thumbnail,
                "condition": item.condition,
                "free_shipping": item.shipping.free_shipping
            });
        });
        this.data.push({['items']: this.items});
    }

    addItemToData(item,description) {
        this.items = [];
          this.items.push({
              "id": item.id,
              "title": item.title,
              "price": {
                "currency": item.currency_id,
                "amount": item.price,
                "decimals":  item.price.toFixed(3)
              },
              "picture": item.thumbnail,
              "condition": item.condition,
              "free_shipping": item.shipping.free_shipping,
              "sold_quantity": item.sold_quantity,
              "description": description,
          });
        this.data.push({['item']: this.items});
    }

    addCategoriasToData(categorias) {
        this.categories = [];
        categorias.sort(((a, b) => b.results - a.results)).forEach((categoria, index) =>  {
            if (index <=4) {
              this.categories.push({
                "name": categoria.name,
                "results": categoria.results,
              });
            }
        });
      this.data.push({['categories']: this.categories});
    }



    get(q) {
        //obtener los productos de la api

        request(`${host}sites/MLA/search?q=${q}&&limit=4`, { json: true },(err,response,body)=>{
            this.data= [];
            this.addAuthorToData();
            this.addCategoriasToData(body.available_filters.length > 0 ?  body.available_filters[0].values : null);
            this.addItemsToData(body.results);
        });

       
        return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(this.data);
            }, 5000);
          })
        // console.log("datap" , this.data)
        // return this.data;
        
    }

    findOneByID(id) {
        request(`${host}/items/${id}`, { json: true },(error,response,body)=>{
            request(`${host}/items/${id}/description`, { json: true },(err,res,data)=>{
                this.data = []
                this.addAuthorToData();
                this.addItemToData(body,data.plain_text);
            });
        });

        return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(this.data);
            }, 5000);
          })
    }
}

module.exports =ItemsService;
