import mongoose from 'mongoose';

const dnsRecordSchema = new mongoose.Schema({
    domainName:{type:String,required:true},
    type:{type:String,required:true },
    fqdn:{type:String,require:true},
    ttl:{type:Number,require:true},
    ipAddress: {type:String,default:null},
});

export default mongoose.model('DNSRecord', dnsRecordSchema);
