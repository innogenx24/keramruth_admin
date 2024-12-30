import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { fetchMembersMemberFailure, fetchMembersMemberRequest, fetchMembersMemberSuccess } from "../../../slices/member-slice/lowhierarchy_member_list_slice/MemberProfileGetSlice";


/** Worker saga to fetch products**/
function* fetchMembersMember(action) {
  const { roleId, memberId } = action.payload;
  console.log("roleId", roleId);
  // const user = JSON.parse(localStorage.getItem('user'));
  // const role = user?.role;
  // const id = user?.id;
  const id = memberId;
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  

// console.log("6666", role);
const API_URL = (() => {
  if (!id || !roleId) {
    console.error("Invalid id or roleId provided");
    return null;
  }

  switch (roleId) {
    case 3:
      return `${API_END_POINT}/directMembers/users-by-ado?adoId=${roleId}&roleId=${roleId}`;
    case 4:
      return `${API_END_POINT}/directMembers/users-by-md?mdId=${id}&roleId=${roleId}`;
    case 5:
      return `${API_END_POINT}/directMembers/users-by-sd?sdId=${id}&roleId=${roleId}`;
    case 6:
      return `${API_END_POINT}/members/cs?distributorId=${id}`;
    default:
      console.error(`Unsupported roleId: ${roleId}`);
      return null;
  }
})();

  try {
    /** Retrieve the token from localStorage **/
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    /** Make API request with the token in the Authorization header**/
    const response = yield call(axios.get, API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    /** Dispatch success action with the fetched data **/
    yield put(fetchMembersMemberSuccess(response.data));
    // console.log("Fetched Products:", response.data);
  } catch (error) {
    /** Dispatch failure action with the error message **/
    yield put(fetchMembersMemberFailure(error.message));
  }
}

/** Watcher saga to trigger fetchProducts on fetchProductsRequest action **/
function* watchFetchMembersMember() {
  yield takeEvery(fetchMembersMemberRequest.type, fetchMembersMember);
}

export default watchFetchMembersMember;
