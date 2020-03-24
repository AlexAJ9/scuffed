import Status from '../../models/Status'

export const queries = {
    Query: {
        statusCount: () => { return Status.collection.countDocuments() },
        allStatuses: () => { return Status.find({}) }
    }
}