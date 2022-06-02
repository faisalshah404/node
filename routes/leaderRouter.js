const express = require('express');
const bodyParser = require('body-parser');
const leaderModel = require("../models/leaders");
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route("/")
    .get((req,res,next) => {
        leaderModel.find({})
            .then((leaders)=>{
                if (leaders.length == 0){
                    let err = new Error("Currently No data available")
                    err.status=404;
                    next(err);
                }else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type","application/json");
                    res.json(leaders)
                }
            },(err)=> next(err))
            .catch((err)=>{
                console.log(err);
                res.statusCode = 500;
            });
    })
    .post((req, res, next) => {
        leaderModel.create(req.body)
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
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res, next) => {
        leaderModel.deleteMany({})
            .then((response)=>{
                res.statusCode =200;
                res.setHeader("Content-Type","application/json");
                res.json(response);
            },(err)=> next(err))
            .catch((err)=>{
                next(err)
            });
    });
leaderRouter.route("/:leaderId")
    .get((req,res,next) => {
        leaderModel.find({_id:req.params.leaderId})
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(dish)
            },(err)=> next(err))
            .catch((err)=>{
                console.log(err);
                res.statusCode = 500;
            });
    })
    .post((req, res, next) => {
        res.end('Post operation is not supported on leaders/' + req.params.leaderId + '/ end');
    })
    .put((req, res, next) => {
        leaderModel.findByIdAndUpdate(req.params.leaderId,{
            $set:req.body
        },{
            new : true
        }).exec()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(dish);
            },(err)=> next(err))
            .catch((err)=>{
                console.log(err);
                res.statusCode = 500;
            });

    })
    .delete((req, res, next) => {
        leaderModel.findByIdAndRemove(req.params.leaderId ,{})
            .then((response)=>{
                res.statusCode =200;
                res.setHeader("Content-Type","application/json");
                res.json(response);
            },(err)=> next(err))
            .catch((err)=>{
                next(err)
            });
    });

module.exports = leaderRouter;