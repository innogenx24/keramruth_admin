import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { categoryEditRequest, categoryEditSuccess, categoryEditFailure } from '../../../slices/master-slice/categort-slice/CategoryEditSlice';
import { fetchCategorysRequest } from "../../../slices/master-slice/categort-slice/CategortGetSlice";

function* editCategory(action) {
  try {
    yield put(categoryEditRequest());
    const token = localStorage.getItem('token');
    const response = yield call(axios.put, `http://88.222.245.236:3002/category/${action?.payload?.id}`, action?.payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(categoryEditSuccess(response.data));
    yield put(fetchCategorysRequest());
  } catch (error) {
    yield put(categoryEditFailure(error.message));
  }
}

export default function* categoryEditSaga() {
  yield takeEvery('categoryEdit/makeEditCategory', editCategory);
}