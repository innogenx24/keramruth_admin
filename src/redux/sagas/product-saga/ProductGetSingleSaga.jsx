import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { fetchProductSingleFailure, fetchProductSingleRequest, fetchProductSingleSuccess } from '../../slices/product-slice/ProductGetSingleSlice';

function* fetchProductSingleSaga(action) {
  try {
    const token = localStorage.getItem('token');
    const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

      const response = yield call(axios.get, `${API_END_POINT}/products/admin_product/${action.payload}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(fetchProductSingleSuccess(response.data));
  } catch (error) {
    yield put(fetchProductSingleFailure(error.message));
  }
}

export function* watchFetchProductSingle() {
  yield takeLatest(fetchProductSingleRequest.type, fetchProductSingleSaga);
}
