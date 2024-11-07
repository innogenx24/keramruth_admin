import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { categoryPostRequest, categoryPostSuccess, categoryPostFailure } from '../../../slices/master-slice/categort-slice/CategoryPostSlice';
import { fetchCategorysRequest } from '../../../slices/master-slice/categort-slice/CategortGetSlice';
function* postCategory(action) {
  try {
    yield put(categoryPostRequest());
    const token = localStorage.getItem('token');
  
    const response = yield call(axios.post, 'http://88.222.245.236:3002/category', action.payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(categoryPostSuccess(response.data));
    yield put(fetchCategorysRequest());
  } catch (error) {
    yield put(categoryPostFailure(error.message));
  }
}

export default function* categoryPostSaga() {
    /* Ensure this matches the action name */
  yield takeEvery('categoryPost/makePostCategory', postCategory);
}
