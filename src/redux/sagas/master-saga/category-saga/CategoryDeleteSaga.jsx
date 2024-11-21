import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure
} from "../../../slices/master-slice/categort-slice/CategoryDeleteSlice";
import { fetchCategorysRequest } from "../../../slices/master-slice/categort-slice/CategortGetSlice";

function deleteCategoryApi(categoryId, token) {
  console.log("categoryId", categoryId);
  return axios.delete(
    `http://88.222.245.236:3002/category/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

function* deleteCategory(action) {
  try {
  console.log("action", action);
    const token = localStorage.getItem("token");
    yield call(deleteCategoryApi, action.payload, token);
    yield put(deleteCategorySuccess());
    yield put(fetchCategorysRequest());
  } catch (error) {
    yield put(deleteCategoryFailure(error.message));
  }
}

export function* watchDeleteCategory() {
  yield takeLatest(deleteCategoryRequest.type, deleteCategory);
}

export default watchDeleteCategory;
