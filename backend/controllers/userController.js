// import User from "../models/UserSchema.js";
// import bcrypt from "bcrypt";

// export const registerControllers = async (req, res, next) => {
//     try{
//         const {name, email, password} = req.body;

//         // console.log(name, email, password);

//         if(!name || !email || !password){
//             return res.status(400).json({
//                 success: false,
//                 message: "Please enter All Fields",
//             }) 
//         }

//         let user = await User.findOne({email});

//         if(user){
//             return res.status(409).json({
//                 success: false,
//                 message: "User already Exists",
//             });
//         }

//         const salt = await bcrypt.genSalt(10);

//         const hashedPassword = await bcrypt.hash(password, salt);

//         // console.log(hashedPassword);

//         let newUser = await User.create({
//             name, 
//             email, 
//             password: hashedPassword, 
//         });

//         return res.status(200).json({
//             success: true,
//             message: "User Created Successfully",
//             user: newUser
//         });
//     }
//     catch(err){
//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }

// }
// export const loginControllers = async (req, res, next) => {
//     try{
//         const { email, password } = req.body;

//         // console.log(email, password);
  
//         if (!email || !password){
//             return res.status(400).json({
//                 success: false,
//                 message: "Please enter All Fields",
//             }); 
//         }
    
//         const user = await User.findOne({ email });
    
//         if (!user){
//             return res.status(401).json({
//                 success: false,
//                 message: "User not found",
//             }); 
//         }
    
//         const isMatch = await bcrypt.compare(password, user.password);
    
//         if (!isMatch){
//             return res.status(401).json({
//                 success: false,
//                 message: "Incorrect Email or Password",
//             }); 
//         }

//         delete user.password;

//         return res.status(200).json({
//             success: true,
//             message: `Welcome back, ${user.name}`,
//             user,
//         });

//     }
//     catch(err){
//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// }

// export const setAvatarController = async (req, res, next)=> {
//     try{

//         const userId = req.params.id;
       
//         const imageData = req.body.image;
      
//         const userData = await User.findByIdAndUpdate(userId, {
//             isAvatarImageSet: true,
//             avatarImage: imageData,
//         },
//         { new: true });

//         return res.status(200).json({
//             isSet: userData.isAvatarImageSet,
//             image: userData.avatarImage,
//           });


//     }catch(err){
//         next(err);
//     }
// }

// export const allUsers = async (req, res, next) => {
//     try{
//         const user = await User.find({_id: {$ne: req.params.id}}).select([
//             "email",
//             "username",
//             "avatarImage",
//             "_id",
//         ]);

//         return res.json(user);
//     }
//     catch(err){
//         next(err);
//     }
// }





import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerControllers = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields",
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const loginControllers = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password",
            });
        }

        // ✅ Remove password before sending user data
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        // ✅ Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            token,
            user: userWithoutPassword,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const setAvatarController = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const imageData = req.body.image;

        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: imageData,
        }, { new: true });

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });

    } catch (err) {
        next(err);
    }
};

export const allUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "name",
            "avatarImage",
            "_id",
        ]);

        return res.json(users);
    } catch (err) {
        next(err);
    }
};
