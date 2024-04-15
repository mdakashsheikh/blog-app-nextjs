import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        min: 4
    },
    description: {
        type: String,
        require: true,
        min: 10
    },
    excerpt: {
        type: String,
        require: true,
        min: 10
    },
    quote: {
        type: String,
        require: true,
        min: 6
    },
    image: {
        id: {
            type: String
        },
        url: {
            type: String
        }
    },
    category: {
        type: String,
        required: true,
        enum: ['Songbirds', 'Waterfowl', 'Birds of pray', 'Seabirds', 'Gamebirds']
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    like: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true })

export default mongoose?.models?.Blog || mongoose.model('Blog', BlogSchema);