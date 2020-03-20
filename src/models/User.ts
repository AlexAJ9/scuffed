import { Schema, model} from 'mongoose'
import uniqueValidator  from 'mongoose-unique-validator'

const userSchema = new Schema({
    name: { type: String, required: true, minLength: 4 },
    screen_name: { type: String, required: true, unique: true, minLength: 4 },
    description: { type:String,minLength:8},
    profile_image_url: { type: String },
    created_at: { type: Date },
    statuses:[{ type: Schema.Types.ObjectId,ref:'Status'}],
    statues_count: { type: Number },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    favorites: [{ type: Schema.Types.ObjectId,red:'Status'}],
    favorites_count: {type:Number }
})
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

userSchema.plugin(uniqueValidator)
const User = model('User', userSchema)
module.exports = User