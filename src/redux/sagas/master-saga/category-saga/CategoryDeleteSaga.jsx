import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure
} from "../../../slices/master-slice/categort-slice/CategoryDeleteSlice";
import { fetchCategorysRequest } from "../../../slices/master-slice/categort-slice/CategortGetSlice";

function deleteCategoryApi(categoryId, token) {

  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  return axios.delete(
    `${API_END_POINT}/category/${categoryId}`,
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
