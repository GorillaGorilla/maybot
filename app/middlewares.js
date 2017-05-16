/**
 * Created by frederickmacgregor on 16/05/2017.
 */
"use strict";

module.exports = {
    getOrdersData : getOrdersData,
    getOrder : getOrder,
    makeOrder : makeOrder
};


function getOrdersData(params) {
    // console.log("getOrderData called", params);
    return Order.find({});

}

function getOrder(params){
    let context = params.update.watsonUpdate.context;
    return Order.find({id : context.orderNumber});
}

function makeOrder(params){
    console.log("makeOrder", params.update.watsonUpdate.context);
    let context = params.update.watsonUpdate.context;
    let time = Moment().add(3, "days");

    let object = {
        product : context.sku,
        size : context.size,
        deliveryDate : time
    };
    params.update.watsonUpdate.context.sku = null;
    params.update.watsonUpdate.context.size = null;
    console.log("object", object);
    return Order.create(object);
}
