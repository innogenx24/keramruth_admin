import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { deleteProductFailure, deleteProductRequest, deleteProductSuccess } from '../../slices/product-slice/ProductDeleteSlice';
import { fetchProductsRequest } from "../../slices/product-slice/ProductGetSlice";

function deleteProductApi(productId, token) {
  // console.log("productId", token);
  return axios.delete(`http://88.222.245.236:3002/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function* deleteProduct(action) {
  try {
    const token = localStorage.getItem('token');
    yield call(deleteProductApi, action.payload, token);
    yield put(deleteProductSuccess());
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put(deleteProductFailure(error.message));
  }
}

export function* watchDeleteProduct() {
  yield takeLatest(deleteProductRequest.type, deleteProduct);
}

export default watchDeleteProduct;
