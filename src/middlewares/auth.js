import { verifyAccessToken } from "../utils/token"

async function authenticate(req,res,next){
    try{
      const headers = req.headers['authorization']
      if(!headers){
        throw unauthorized("No auth headers found")
      }
      const token = headers.split(' ')?.[1]??null
      if(!token){
        throw unauthorized("No auth token found")
      }

      const payload = verifyAccessToken(token)
      if(payload == null){
        throw unauthorized("Invalid token.")
      }
      req.user = payload
      next()
    }catch(error){
      next(error)
    }
 
}