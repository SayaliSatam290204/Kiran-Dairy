import Dispatch from '../models/Dispatch.js';
import { generateDispatchNo } from '../utils/generateDispatchNo.js';
import { responseHelper } from '../utils/responseHelper.js';

export const dispatchController = {
  create: async (req, res) => {
    try {
      const { shopId, items } = req.body;

      if (!shopId || !items || items.length === 0) {
        return responseHelper.error(res, 'Invalid dispatch data', 400);
      }

      const dispatchNo = await generateDispatchNo();
      
      const dispatch = new Dispatch({
        dispatchNo,
        shopId,
        items,
        status: 'created'
      });

      await dispatch.save();
      responseHelper.success(res, dispatch, 'Dispatch created successfully', 201);
    } catch (error) {
      console.error('Error creating dispatch:', error);
      responseHelper.error(res, 'Failed to create dispatch', 500);
    }
  },

  getAll: async (req, res) => {
    try {
      const dispatches = await Dispatch.find()
        .populate('shopId', 'name location')
        .populate('items.productId', 'name sku')
        .limit(100);
      
      responseHelper.success(res, dispatches, 'Dispatches fetched successfully');
    } catch (error) {
      console.error('Error fetching dispatches:', error);
      responseHelper.error(res, 'Failed to fetch dispatches', 500);
    }
  }
};
