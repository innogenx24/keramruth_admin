import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { productPostFailure, productPostRequest, productPostSuccess } from '../../slices/product-slice/ProductPostSlice';
import { fetchProductsRequest } from '../../slices/product-slice/ProductGetSlice';
function* postProduct(action) {
  try {
    yield put(productPostRequest());
    const token = localStorage.getItem('token');
    const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

    const response = yield call(axios.post, `${API_END_POINT}/products`, action.payload, {

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
