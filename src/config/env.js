import 'dotenv/config'
import z from 'zod'


const isProduction = process.env.NODE_ENV == 'production'
const DEV_ACCESS_SECRET = 'change-before-prod'
const DEV_REFRESH_SECRET = 'change-before-prod'

const envSchema = z.object({
 PORT:z.coerce().number().int().positive().default(3000),
 NODE_ENV:z.enum(['development','production','testing']).default('development'),
 DATABASE_URL:z.url(),
 ACCESS_JWT_SECRET:z.string().min(32).default(DEV_ACCESS_SECRET),
 REFRESH_JWT_SECRET:z.string().min(32).default(DEV_REFRESH_SECRET),
 ACCESS_TOKEN_EXPIRES_IN_SECS:z.coerce().number().int().positive().default(15*60),
 REFRESH_TOKEN_EXPIRES_IN_SECS:z.coerce().number().int().positive().default(7*24*60*60),
})

export const env = z.parse(envSchema);


if(isProduction){
    
    if (env.ACCESS_JWT_SECRET === DEV_ACCESS_SECRET) {
        throw new Error("Cannot start production with default ACCESS_JWT_SECRET.");
    }
    if (env.REFRESH_JWT_SECRET === DEV_REFRESH_SECRET) {
        throw new Error("Cannot start production with default REFRESH_JWT_SECRET.");
    }

}