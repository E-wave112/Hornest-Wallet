import { ConfigService } from "@nestjs/config"
import configuration from "../config/configuration"
const configService:ConfigService = new ConfigService(configuration)
const port = configService.get<string|number>('PORT')
export const host = () =>  {
    return configService.get('NODE_ENV') === 'production' ? 'https://hornest-api.herokuapp.com' : `http://localhost:${port}`

}