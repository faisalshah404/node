const mongoose = require("mongoose");
mongoose.plugin(schema => { schema.options.usePushEach = true });
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;
const Comments = new Schema({
    rating :{
        type: Number,
        min:1,
        max:5,
        required : true
    },
    comment:{
        type : String
    },
    author:{
        type : String
    }
},{
    timestamps: true,
});
const dishSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type : Currency,
        required : true,
        min : 0
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default:false
    },
    comments : [Comments]
},{
    timestamps: true
});

var Dishes = mongoose.model('Dish',dishSchema);
module.exports =Dishes;