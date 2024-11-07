import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { productEditFailure, productEditRequest, productEditSuccess } from '../../slices/product-slice/ProductEditSlice';
import { fetchProductsRequest } from "../../slices/product-slice/ProductGetSlice";

function* editProduct(action) {
  try {
    yield put(productEditRequest());
    const token = localStorage.getItem('token');
    const response = yield call(axios.put, `http://88.222.245.236:3002/products/${action?.payload?.id}`, action?.payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(productEditSuccess(response.data));
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put(productEditFailure(error.message));
  }
}

export default function* productEditSaga() {
  yield takeEvery('productEdit/makeEditProduct', editProduct);
}
