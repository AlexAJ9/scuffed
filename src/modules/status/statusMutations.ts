import Status from '../../models/Status'
const { UserInputError } = require('apollo-server')



export const mutations = {
    Mutation: {
        addStatus: async(root, args) => {
            const newStatus = new Status({ ...args })
            try{
               await newStatus.save()
            }
            catch(err){
                throw new UserInputError(err.message, {
                    invalidArgs:args
                })
            }
            return  newStatus
        },
        editStatus: async (root, args) => {
            const statusObj = {
                status_text: args.status_text,
                status_tags: args.status_tags,
                status_picture_url:args.status_picture_url,
            }
            const updatedStatus = await Status.findByIdAndUpdate(args.id,statusObj, { new: true })
            return updatedStatus
        },
        starStatus: async (root, args) => { 
            const stars = await (await Status.findById(args.id)).toObject().stars            
            const updatedStatus = await Status.findByIdAndUpdate(args.id, { stars: stars + 1 }, { new: true })
            return updatedStatus
        },
        comment: async (root, args) => { 
            const statusToUpdate = await (await Status.findById(args.id)).toObject()
            const status = await Status.findByIdAndUpdate(args.id, { comments:statusToUpdate.comments.concat(args.comment) }, { new: true })
            return status
        }
    }
    
}