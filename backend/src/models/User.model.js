import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs"
import { type } from "os";

const userSchema = new Schema({
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        lowercase:true,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength: 6
    },
    bio:{
        type:String,
        default:""
    },
    profilePics:{
        type:String,
        default:""
    },
    nativeLanguage:{
        type:String,
        default:""
    },
    learningLanguage:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    isOnBoarded:{
        type:Boolean,
        default:false
    },
    friends:[
        {
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    resetPasswordToken : {
        type: String
    },
    resetPasswordExpire: {
        type: Date,
    }
},{timestamps:true});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
   return await bcrypt.compare(password,this.password)
};

export const User = mongoose.model("User",userSchema)