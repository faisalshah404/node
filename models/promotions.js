const mongoose = require("mongoose");
mongoose.plugin(schema => { schema.options.usePushEach = true });
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
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
    label: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default:false
    }
},{
    timestamps: true
});

let Promotion = mongoose.model('promotion',promotionSchema);
module.exports =Promotion;