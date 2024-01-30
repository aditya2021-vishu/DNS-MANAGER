import express from 'express';
import {signup,login,googleLogin,getDomainRecords,getProjectRecords,createProject,addRecords,deleteRecord} from '../controllers/apiControllers.js';
import { auth } from '../middleware/auth.js';


const router = express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/googlelogin",googleLogin);
router.get("/domainRecords/:domain",getDomainRecords);
router.post("/createProject",auth,createProject);
router.post("/addRecords",auth,addRecords);
router.post("/deleteRecord",auth,deleteRecord);
router.set("/getProjects",auth,getProjectRecords);

export default router;
