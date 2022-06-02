const mongoose = require("mongoose");
mongoose.plugin(schema => { schema.options.usePushEach = true });
const Schema = mongoose.Schema;

const LeaderSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    designation:{
        type:String,
        required:true,
    },
    abbr:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default:false
    }
},{
    timestamps: true
});

let leaders = mongoose.model('leader',LeaderSchema);
module.exports =leaders;