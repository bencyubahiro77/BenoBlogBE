import { User } from "../models/userModel";

export const seedAdmin = async () =>{
    try{
        const adminExist = await User.findOne({role: 'admin'});
        if(!adminExist){
            const admin = new User({
                uuid: "123e4567-e89b-12d3-a456-426614174000",
                name: 'Admin',
                email: process.env.AdminEmail,
                phoneNumber: '0782522792', 
                role: 'admin',
                password: process.env.AdminPassword, 
            });

            await admin.save();
            console.log('Admin user created with default credentials.');
        }
        
    }catch (err) {
        console.log(err);
    }
}