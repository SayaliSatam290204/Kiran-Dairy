import mongoose from 'mongoose';

const dispatchSchema = new mongoose.Schema(
  {
    dispatchNo: {
      type: String,
      required: true,
      unique: true
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        status: {
          type: String,
          enum: ['pending', 'received', 'rejected'],
          default: 'pending'
        }
      }
    ],
    status: {
      type: String,
      enum: ['created', 'dispatched', 'received', 'pending'],
      default: 'created'
    },
    dispatchDate: {
      type: Date,
      default: Date.now
    },
    receivedDate: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.model('Dispatch', dispatchSchema);
