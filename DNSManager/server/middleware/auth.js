import jwt from 'jsonwebtoken';

export const auth = async(req,res,next) =>{
    try {
       const token = req.cookies.jwtoken;
       let decodedData;
       if(token){
        decodedData = jwt.verify(token,process.env.SECRET_KEY);//give data for each specific token like username and id
        req.userId = decodedData?.id;
        next();
       }else{
        res.status(400).json({message:"Unauthorized User"});
       }
    } catch (error) {
      res.status(500).json({message : "Something went wrong! Try Again!!"}); 
    }
}
