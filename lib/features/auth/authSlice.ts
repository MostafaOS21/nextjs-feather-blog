import { createSlice } from "@reduxjs/toolkit";

export interface IAuthData {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatar: string;
  bio: string;
  blogsPublished: number;
  reads: string;
}

const initialState: IAuthData & { isAuth: boolean } = {
  id: "",
  email: "",
  fullName: "",
  username: "",
  avatar: "",
  bio: "",
  blogsPublished: 0,
  reads: "",
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.isAuth = true;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.fullName = action.payload.fullName;
      state.username = action.payload.username;
      state.avatar = action.payload.avatar;
      state.bio = action.payload.bio;
      state.blogsPublished = action.payload.blogsPublished;
      state.reads = action.payload.reads;
    },

    changeAvatar(state, action) {
      state.avatar = action.payload;
    },

    changeUsername(state, action) {
      state.username = action.payload;
    },

    changeBio(state, action) {
      state.bio = action.payload;
    },

    updateData(state, action) {
      state.username = action.payload.username;
      state.bio = action.payload.bio;
    },

    logOut: (state) => {
      state.isAuth = false;
      state.id = "";
      state.email = "";
      state.fullName = "";
      state.username = "";
      state.avatar = "";
      state.bio = "";
      state.blogsPublished = 0;
      state.reads = "";
    },
  },
});

export const selectAuth = (state: { auth: IAuthData & { isAuth: boolean } }) =>
  state.auth;
export const {
  logIn,
  logOut,
  changeAvatar,
  changeUsername,
  changeBio,
  updateData,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authSlice;
