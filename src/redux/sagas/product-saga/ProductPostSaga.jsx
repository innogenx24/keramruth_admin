import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { productPostFailure, productPostRequest, productPostSuccess } from '../../slices/product-slice/ProductPostSlice';
import { fetchProductsRequest } from '../../slices/product-slice/ProductGetSlice';
function* postProduct(action) {
  try {
    yield put(productPostRequest());
    const token = localStorage.getItem('token');
    // const response = yield call(axios.post, 'http://88.222.245.236:3002/products', action.payload, {
    const response = yield call(axios.post, 'http://localhost:3002/products', action.payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(productPostSuccess(response.data));
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put(productPostFailure(error.message));
  }
}

export default function* productPostSaga() {
    /* Ensure this matches the action name */
  yield takeEvery('productPost/makePostProduct', postProduct);
}
