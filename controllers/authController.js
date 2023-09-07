const JWT = require("jsonwebtoken")
const bycrypt = require("bcryptjs");
const { User } = require("../models/User");


//Register

exports.register = async(req,res)=>{
    try{
        //hash password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(req.body.password, salt);


        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword ,
            photo:req.body.photo,
        })
        await newUser.save();
        return res.status(201).send({
            success:true,
            message:"User created successfully",
            data:newUser
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success:false,
            message:"Internal server error",
            err
        })
    }
}

//Login

exports.login = async(req,res)=>{
    
    const email = req.body.email;
    try{
        const user = await User.findOne({email})
        
        //if user does not exist
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Invalid Credentials"
            })
        }

        //if user is exists then check the password
        const comparePassword = await bycrypt.compare(req.body.password,user.password);

        if(!comparePassword){
            return res.status(500).send({
                success:false,
                message:"Invalid Credentials"
            })
        }
        
        const {password,role,...rest} = user._doc;
        const token = JWT.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{
            expiresIn :"5d",
        })

        //set token in the browser cookies and send the response to client

        return res.cookie("accessToken",token,{
            httpOnly :true,
            expires:token.expiresIn,
        }).status(200).send({
            success:true,
            message:"Login Successfully",
            data:{...rest},
            token,
            role
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success:false,
            message:"Error in Login API",
            err
        })
    }
}