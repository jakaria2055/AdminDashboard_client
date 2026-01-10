import { create } from "zustand";
import axios from "axios";
import { setEmail } from "../utility/utility";

const BaseURL = "http://localhost:3000/api/v1";
// const BaseURL = "https://medinfo-server-seven.vercel.app/api/v1";

const AdminStore = create((set) => ({
  isAdmin: () => {
    return !!localStorage.getItem("accesstoken");
  },

  AdminFormData: { email: "", password: "" },
  AdminFormChange: (name, value) => {
    set((state) => ({
      AdminFormData: {
        ...state.AdminFormData,
        [name]: value,
      },
    }));
  },

  RegisterFormData: {email:"", password:"", name: ""},
  RegisterFormChange: (name, value) => {
    set((state) => ({
      RegisterFormData: {
        ...state.RegisterFormData,
        [name]: value,
      },
    }));
  },

  isFormSubmit: false,
  AdminRegisterRequest: async (postBody) => {
    set({ isFormSubmit: true });
    let res = await axios.post(`${BaseURL}/admin/register`, postBody);
    setEmail(postBody.email);
    set((state) => ({
      RegisterFormData: { ...state.RegisterFormData, email: postBody.email },
    }));

    set({ isFormSubmit: false });
    return res.data.success === true;
  },

   LoginRequest: async (postBody) => {
    set({ isFormSubmit: true });
    let res = await axios.post(`${BaseURL}/admin/login`, postBody);
    set({ isFormSubmit: false });
    localStorage.setItem("accesstoken", res.data.accesstoken);
    return res.data.success === true;
  },

  UserLogoutRequest: async () => {
    set({ isFormSubmit: true });
    try {
     
      let res = await axios.post(
        `${BaseURL}/admin/logout`,
        {},
        {
          headers: {
            accesstoken: localStorage.getItem("accesstoken"),
          },
        }
      );
      set({ isFormSubmit: false });
      return res.data.success === true;
    } catch (e) {
      console.log(e);
      set({ isFormSubmit: false });
      return false;
    }
  },
}));

export default AdminStore;
