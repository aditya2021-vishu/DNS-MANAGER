import axios from 'axios';
import {google} from 'googleapis';
import Compute from '@google-cloud/compute';
import dns from '@google-cloud/dns';
import User from '../models/userModel.js';
import Domain from '../models/domainModel.js';
import DNSRecord from '../models/dnsRecordModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.OAUTHCLIENTID);

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'C:\Users\adity\Downloads\stellar-state-412506-afde58779b6f.json';
const projectId = process.env.PROJECT_ID;


// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Internal Server Error' });
// });

async function createRecord(instanceName,domainName,zoneName,ttl,type){
    try{
        // create a VM instance with a new IP address
        const compute = new Compute({projectId});
        const zone = compute.zone(zoneName);
        const instance = zone.instance(instanceName);
        const instanceCreationOptions = {
            machineType: 'n2-standard-2',
            bootDisk: {
            initializeParams: {
                image: 'debian-cloud/debian-11',
            },
            sizeGb: 7,
            },
            networkInterface: {
            network: 'global/networks/default',
            },
            metadata: {
            items: [{
                key: 'app-name',
                value: 'my-web-app',
            }],
            },
        };
        const [response] = await instance.create(instanceCreationOptions);
        const ipAddress = response.networkInterfaces[0].accessConfigs[0].natIP;

        // Create a DNS record ....
        const dnsClient = new dns.v1({ projectId }); 
        const managedZone = dnsClient.managedZone(zoneName);
        await managedZone.changes().create({
            additions: [
                {
                    name: instanceName + '.' + domainName + '.',
                    type,
                    ttl,
                    rrdatas: [ipAddress],
                },
            ],
        });

        return { ipAddress };
    }
    catch(error){
        next(error);
    }
}

async function delete_Record(fqdn,type,ttl,zoneName){
    try{
        const dnsClient = new dns.v1({ projectId });
        const managedZone = dnsClient.managedZone(zoneName);
        // deleting dns record...
        await managedZone.changes().create({
            deletions: [
                {
                    name: fqdn,
                    type,
                    ttl,
                }, 
            ],
            additions: [],
        });
    }
    catch(error){
        next(error);
    }
}

async function createDnsZone(domainName,zoneName) {
    try {
        const dnsClient = new dns.v1({ projectId });
        // creating zone...
        const createdZone = await dnsClient.managedZones.create({
            name: zoneName,
            description: "Zone created programmatically",
            dnsName: domainName,
            visibility: 'public',
        });
        return createdZone;
    }catch(error){
       console.error('Error creating zone:', error);
       return null; 
    }
}

async function createNewProject(domainName,zoneName) {
    try{
        const createdZone = await createDnsZone(domainName,zoneName);
        return createdZone;
    }catch(error) {
        console.error('Error creating DNS record with IP:', error);
        throw error;
    }
}

export const signup = async(req,res,next)=>{
    try{
        const {name,email,password,confirmpassword} = req.body;
        console.log(req.body);
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message:"User already exist."});
        const hashedPassword = await bcrypt.hash(password,12);
        const result = await User.create({name,email,password:hashedPassword});
        const token = jwt.sign({email:result.email,id:result._id},process.env.SECRET_KEY,{expiresIn:"7d"});
        res.cookie("jwtoken",token,{expires : new Date(Date.now()+604800000),httpOnly: false});
        res.status(200).json({result: result,token});
    }
    catch(error){
        next(error);
    }
}

export const login = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(!existingUser) return res.status(404).json({message:"User doesn't exist"});
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials!"});
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},process.env.SECRET_KEY,{expiresIn:"7d"});
        res.cookie("jwtoken",token,{expires : new Date(Date.now()+604800000),httpOnly: false});
        res.status(200).json({result: existingUser,token});
    }
    catch(error){
        next(error);
    }
}

export const googleLogin = async(req,res)=>{
    const {tokenId} = req.body;
    try {
      //verify token from frontend and backend
      const verifyToken = await client.verifyIdToken({idToken:tokenId,audience:process.env.OAUTHCLIENTID});
      const {email_verified,name,email} = verifyToken.payload;
      const existingUser = await User.findOne({email});
      if(!existingUser){
        const password = email+process.env.SECRET_KEY;
        const hashedPassword = await bcrypt.hash(password,12);
        const result = await User.create({name,email,password:hashedPassword,verified:email_verified});
        const token = jwt.sign({email:result.email,id:result._id},process.env.SECRET_KEY,{expiresIn:"7d"});
        res.cookie("jwtoken",token,{expires : new Date(Date.now()+604800000),httpOnly: false});
        res.status(201).json({result,token});
      }
      else{
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},process.env.SECRET_KEY,{expiresIn:"7d"});
        res.cookie("jwtoken",token,{expires : new Date(Date.now()+604800000),httpOnly: false});
        res.status(200).json({result: existingUser,token});
      }
    } catch (error) {
      res.status(500).json({message : "Internal Server Error! Try Again!!"});
    }
  }

export const getDomainRecords = async (req, res,next) => {
    try{
        const domain = req.params.domain;
        const records = await DNSRecord.find({domainName:domain});
        res.json(records);
    }catch(error) {
        next(error);
    }
};

export const getProjectRecords = async(req,res,next)=>{
    try{
        const userId = req.userId;
        const projects = await Domain.find({userId:userId});
        res.json(projects);
    }
    catch(error){
        next(error);
    }
}

export const createProject = async (req, res, next)=>{
    try{
        const {domainName,zoneName} = req.body;
        const id = req.userId;
        if (!id || !domainName || !zoneName){
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const getDomain = await Domain.findOne({domainName});
        if(getDomain) return res.status(400).json({message:"domain already added"});
        const createdZone = await createNewProject(domainName,zoneName);
        const addDomain = await Domain.create({
            userId:id,
            domainName:domainName,
            zoneName:zoneName
        });
        res.status(200).json(addDomain);
    }catch(error) {
        next(error);
    }
};

export const addRecords = async(req,res,next)=>{
    try{
        const {instanceName,domainName,ttl,type} = req.body;
        const id = req.userId;
        const checkDomain = await Domain.findOne({userId:id,domainName:domainName});
        if(!checkDomain){
            res.status(400).json({message:"Can not create record this domain name do not belongs to you"});
        } 
        if(!instanceName || !domainName || !type){
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const getDomain = await Domain.findOne({domainName});
        const zoneName = getDomain.zoneName;
        const {createdRecord,ipAddress} = await createRecord(instanceName,domainName,zoneName,ttl,type);
        const newRecord = await DNSRecord.create({
            domainName:domainName,
            type:type,
            fqdn:instanceName+'.'+domainName+'.',
            ttl:ttl,
            ipAddress:ipAddress
        });
        return res.status(200).json(newRecord);
    }
    catch(error){
        next(error);
    }
};

export const deleteRecord = async(req,res,next)=>{
    try{
        const {domainName,type,fqdn,ttl}=req.body;
        const id = req.userId;
        const checkDomain = await Domain.findOne({userId:id,domainName:domainName});
        if(!checkDomain){
            res.status(400).json({message:"Can not delete record this domain name do not belongs to you"});
        } 
        const getDomain = await Domain.findOne({domainName});
        const zoneName = getDomain.zoneName;
        await delete_Record(fqdn,type,ttl,zoneName);
        await DNSRecord.deleteOne({fqdn:fqdn});
        res.status(200).json({message:"Succesfully deteted record"});
    }
    catch(error){
        next(error);
    }
};
