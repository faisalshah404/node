const express = require('express');
const bodyParser = require('body-parser');
const promotions = require("../models/promotions");
const promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route("/")
    .get((req,res,next) => {
        promotions.find({})
            .then((promoData)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(promoData)
            },(err)=> next(err))
            .catch((err)=>{
                console.log(err);
                res.statusCode = 500;
            });
    })
    .post((req, res, next) => {
        promotions.create(req.body)
            .then((data)=>{
                console.log(data);
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(data);
            },(err)=> next(err))
            .catch((err)=>next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res, next) => {
        promotions.deleteMany({})
            .then((response)=>{
                res.statusCode =200;
                res.setHeader("Content-Type","application/json");
                res.json(response);
            },(err)=> next(err))
            .catch((err)=>{
                next(err)
            });
    });

promoRouter.route("/:promoId")
    .get((req,res,next) => {
        promotions.find({_id:req.params.promoId})
            .then((promoData)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(promoData)
            },(err)=> next(err))
            .catch((err)=>{
                console.log(err);
                res.statusCode = 500;
            });
    })
    .post((req, res, next) => {
        res.end('Post operation is not supported on promotions/'+req.params.promoId+'/ end');
    })
    .put((req, res, next) => {
        promotions.findByIdAndUpdate(req.params.promoId,{
            $set:req.body
        },{
            new : true
        }).exec()
            .then((data)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(data);
            },(err)=> next(err))
            .catch((err)=>{
                console.log(err);
                res.statusCode = 500;
            });

    })
    .delete((req, res, next) => {
        promotions.findByIdAndRemove(req.params.promoId ,{})
            .then((response)=>{
                res.statusCode =200;
                res.setHeader("Content-Type","application/json");
                res.json(response);
            },(err)=> next(err))
            .catch((err)=>{
                next(err)
            });
    });

module.exports = promoRouter;