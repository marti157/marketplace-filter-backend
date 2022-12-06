import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    id: { type: String, unique: true },
    title: String,
    description: String,
    location: String,
    price: Number,
    images: [String],
    link: String,
    dateCreated: Date,
    dateUpdated: Date,
    new: Boolean,
    removed: Boolean,
  },
  { timestamps: true },
);

export default mongoose.model('Item', itemSchema);
