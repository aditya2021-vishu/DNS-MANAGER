import mongoose , {Schema} from "mongoose";

const domainSchema = new mongoose.Schema({
    userId:{type:Schema.Types.ObjectId,required:true,ref:"User"},
    domainName:{type:String,required:true},
    zoneName:{type:String,required:true},
});

export default mongoose.model('Domain',domainSchema);
