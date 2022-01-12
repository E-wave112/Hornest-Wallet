import { Injectable } from '@nestjs/common';
import Flutterwave from 'flutterwave-node-v3';
import { UsersService } from '../users/users.service';
import { HttpException } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { Wallet } from './wallet.entity';
const FLW_PUBLIC_KEY: string = process.env.FLW_PUBLIC_KEY
const FLW_SECRET_KEY: string = process.env.FLW_SECRET_KEY

@Injectable()
export class WalletService {
    constructor(
        private userService : UsersService) {}
    async flutterwaveCharge(payload: any) {
        let flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);
        try {
            const response = await flw.Charge.card(payload)
            console.log(response)
            if (response.meta.authorization.mode === 'pin') {
                let payload2 = payload
                payload2.authorization = {
                    "mode": "pin",
                    "fields": [
                        "pin"
                    ],
                    "pin": payload.pin
                }
                const reCallCharge = await flw.Charge.card(payload2)

                const callValidate = await flw.Charge.validate({
                    "otp": payload.otp,
                    "flw_ref": reCallCharge.data.flw_ref
                })
                // console.log(callValidate)

            }
            if (response.meta.authorization.mode === 'redirect') {

                var url = response.meta.authorization.redirect
                open(url)
            }

            console.log(response)

            return response.data
        } catch (error: any) {
            console.error(error)
            throw new HttpException(error.message, 500);
        }

    }

    async flutterwaveWithdraw(payload:object) {
        let flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);
        try {
            const response = await flw.Charge.ng(payload)
            return response.data
        } catch (error:any) {
            console.error(error)
            throw new HttpException(error.message, 500);
        }
    }


    async getBankCode(bank:string){
        let bank_code:string = ""
        switch (bank_code) {
            case bank = "Access Bank":
                bank_code = "044"
                break;

            case bank = "Ecobank":
                bank_code = "050"
                break;

            case bank = "Fidelity Bank":
                bank_code = "070"
                break;

            case bank = "First Bank of Nigeria":
                bank_code = "011"
                break;

            case bank = "First City Monument Bank (FCMB)":
                bank_code = "214"
                break;

            case bank = "GTBank":
                bank_code = "058"
                break;    


            case bank = "Heritage Bank":
                bank_code = "030"
                break; 
                
            case bank = "Keystone Bank":
                bank_code = "082"
                break;   
                
            case bank = "Stanbic IBTC Bank":
                bank_code = "221"
                break;    

            case bank = "Sterling Bank":
                bank_code = "232"
                break;

            case bank = "Union Bank":
                bank_code = "032"
                break;

            case bank = "United Bank for Africa":
                bank_code = "033"
                break;

            case bank = "Unity Bank":
                bank_code = "215"
                break;

            case bank = "Wema Bank":
                bank_code = "035"
                break;

            case bank = "Zenith Bank":
                bank_code = "057"
                break;
        
            default:
                bank_code = "044"
                break;
        }

        return bank_code
    }

    async checkIfWalletExists(obj:object) {
        try {
            const walletRepository = getRepository(Wallet)
            return await walletRepository.findOne(obj)
        } catch (error) {
            console.error(error)
            throw new HttpException(error.message,500)
        }

    }


}
