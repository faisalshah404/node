const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dishModel = require("../models/dishes");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get((req,res,next) => {
        dishModel.find({})
            .then((dishes)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(dishes)
            },(err)=> next(err))
            .catch((err)=>{
                console.log(err);
                res.statusCode = 500;
            });
    })
    .post((req, res, next) => {
        dishModel.create(req.body)
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
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req, res, next) => {
        dishModel.deleteMany({})
            .then((response)=>{
                res.statusCode =200;
                res.setHeader("Content-Type","application/json");
                res.json(response);
            },(err)=> next(err))
            .catch((err)=>{
                next(err)
            });
    });

dishRouter.route('/:dishId/')
    .get((req,res,next) => {
        dishModel.find({_id:req.params.dishId})
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
        res.end('Post operation is not supported on dishes/dishId/ end');
    })
    .put((req, res, next) => {
        dishModel.findByIdAndUpdate(req.params.dishId,{
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
        dishModel.findByIdAndRemove(req.params.dishId ,{})
            .then((response)=>{
                res.statusCode =200;
                res.setHeader("Content-Type","application/json");
                res.json(response);
            },(err)=> next(err))
            .catch((err)=>{
                next(err)
            });
    });
dishRouter.route("/:dishId/comments")
    .get((req ,res,next)=>{
        dishModel.findById(req.params.dishId)
            .then((dish)=>{
                if (dish != null ){
                    res.statusCode =200;
                    res.setHeader("Content-Type","application/json");
                    res.json(dish.comments);
                }else {
                    let err = new Error("Sorry ... Dish "+ req.params.dishId+" not found");
                    err.status =404;
                }
            },(err)=>next(err))
            .catch((err)=>next(err));
    })
    .post((req,res,next)=>{
        dishModel.findById(req.params.dishId)
            .then((dish)=>{
                if(dish != null){
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish)=>{
                            res.statusCode =200;
                            res.setHeader("Content-Type","application/json");
                            res.json(dish.comments);
                        },(err)=>next(err))
                        .catch((err)=>next(err));
                }else {
                    let err = new Error("Sorry ... Dish "+ req.params.dishId+" not found");
                    err.status=404;
                    next(err);
                }
            },(err)=>next(err))
            .catch((err)=>next(err));
    })
    .put((req ,res ,next)=>{
        res.statusCode = 403;
        res.setHeader("Content-Type","text/html");
        res.end("Operation not supported on rout '/dishes/"+req.params.dishId +"/comments'");
    })
    .delete((req,res,next)=>{
        dishModel.findById(req.params.dishId)
            .then((dish)=>{
                if(dish != null ){
                    for(let i= dish.comments.length-1; i>=0 ; i--){
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save()
                    .then((dish)=>{
                            res.statusCode =200;
                            res.setHeader("Content-Type","application/json");
                            res.json(dish.comments);
                        },(err)=>next(err))
                        .catch((err)=>next(err));
                }else {
                    let err = new Error("Dish "+ req.params.dishId +" not found.")
                    err.status = 404;
                    next(err);
                }
            },(err)=>next(err))
            .catch((err)=> next(err));
    });

dishRouter.route("/:dishId/comments/:commentId")
    .get((req ,res,next)=>{
        dishModel.findById(req.params.dishId)
            .then((dish)=>{
                if (dish != null && dish.comments.id(req.params.commentId) != null ){
                    res.statusCode =200;
                    res.setHeader("Content-Type","application/json");
                    res.json(dish.comments.id(req.params.commentId));
                }else if (dish == null){
                    let err = new Error("Sorry ... Dish "+ req.params.dishId+" not found");
                    err.status =404;
                    next(err);
                }else {
                    let err = new Error("Sorry ... Comment "+ req.params.commentId+" not found");
                    err.status =404;
                    next(err);
                }
            },(err)=>next(err))
            .catch((err)=>next(err));
    })
    .post((req,res,next)=>{
        res.statusCode = 403;
        res.setHeader("Content-Type","text/html");
        res.end("Operation not supported on rout '/dishes/"+req.params.dishId +"/comments'"+req.params.commentId);
    })
    .put((req ,res ,next)=>{
        dishModel.findById(req.params.dishId)
            .then((dish)=>{
                if (dish != null && dish.comments.id(req.params.commentId) != null ){
                    if(req.body.rating){
                        dish.comments.id(req.params.commentId).rating=req.body.rating;
                    }
                    if(req.body.comment){
                        dish.comments.id(req.params.commentId).comment=req.body.comment;
                    }
                    dish.save()
                        .then((dish)=>{
                            res.statusCode =200;
                            res.setHeader("Content-Type","application/json");
                            res.json(dish.comments.id(req.params.commentId));
                        },(err)=>next(err))
                        .catch((err)=>next(err));
                }else if (dish == null){
                    let err = new Error("Sorry ... Dish "+ req.params.dishId+" not found");
                    err.status =404;
                    next(err);
                }else {
                    let err = new Error("Sorry ... Comment "+ req.params.commentId+" not found");
                    err.status =404;
                    next(err);
                }
            },(err)=>next(err))
            .catch((err)=>next(err));
    })
    .delete((req,res,next)=>{
        dishModel.findById(req.params.dishId)
            .then((dish)=>{
                if (dish != null && dish.comments.id(req.params.commentId) != null ){
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish)=>{
                            res.statusCode =200;
                            res.setHeader("Content-Type","application/json");
                            res.json(dish.comments);
                        },(err)=>next(err))
                        .catch((err)=>next(err));
                }else if (dish == null){
                    let err = new Error("Sorry ... Dish "+ req.params.dishId+" not found");
                    err.status =404;
                    next(err);
                }else {
                    let err = new Error("Sorry ... Comment "+ req.params.commentId+" not found");
                    err.status =404;
                    next(err);
                }
            },(err)=>next(err))
            .catch((err)=>next(err));
    });


module.exports = dishRouter;