// import mongoose, { model, Schema }  from "mongoose";
// const teamSchema = new Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     members:[{
//         type:Schema.Types.ObjectId,
//         ref: "User"
//     }],
//     contests:[{
//         type: Schema.Types.ObjectId,
//         ref: "Contest"
//     }],
//     isSubmitted:{
//         type:Boolean,
//         default:false
//     },
//     quality:{
//         type:Number,
//         min:1,
//         max:5
//     },
//     creativity:{
//       type:Number,
//         min:1,
//         max:5
//     },
//     completion:{
//         type:Number,
//         min:1,
//         max:5
//     },
//     reusability:{
//         type:Number,
//         min:1,
//         max:5
//     },
//     githubLink:{
//         type:String
//     },
//     liveUrl:{
//         type:String
//     }
// },
// {
//     timestamps:true
// }
// )

// export const Team = model("Team",teamSchema)