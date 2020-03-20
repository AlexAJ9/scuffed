import {Schema,model} from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const statusSchema = new Schema({
    status_text: { type: String },
    created_at: { type: Date },
    status_picture_url: { type: String },
    status_tags: [{ type: String }],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    favorites_count: { type: Number },
})

statusSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        returnedObject.date=returnedObject.created_at.toLocaleDateString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
statusSchema.plugin(uniqueValidator)
const Item = model('Status', statusSchema)
module.exports = Item