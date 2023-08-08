import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  UPDATE_PROFILE_REQ,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  CLEAR_ERRORS
} from "../constants/userConstants";



import axios from './AxiosInstance';


export const login = (email, password) => async (dispatch) => {
   try {
    dispatch({type: LOGIN_REQUEST});
    

    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    const {data} = await axios.post(`/login`, {email, password}, config);
    console.log('login data', login);

    dispatch({
        type: LOGIN_SUCCESS,
        payload: data.user
    })

   

   } catch (error) {
    console.log('LOGINERROR',error.response.data.message);
    dispatch({
        type: LOGIN_FAIL,
        payload: "Invalid credentials"
    });
   }
}



export const register = (userData) => async (dispatch) => {
    try {

        dispatch({type: REGISTER_USER_REQUEST});

        const config = {
            withCredentials: true,
            headers: {
                 
                'Content-Type': 'multipart/form-data'
            }
        };

        const {data} = await axios.post(`register`, userData, config);

        // console.log('register data', data);


        dispatch({type: REGISTER_USER_SUCCESS, payload: data.user})

        
    } catch (error) {
         console.log('error in register-reducer', error);
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.message
        });
    }
}

//load user




export const loadUser = () => async (dispatch) => {
    try {
      dispatch({ type: LOAD_USER_REQUEST });
  
      const { data } = await axios.get(`http://localhost:4000/api/v1/me`);
  
      dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
    } catch (error) {
        // console.log(error.response.data);
      dispatch({ type: LOAD_USER_FAIL, payload: error.message });
    }
  };


export const logout = () => async (dispatch) => {
    try {
        await axios.get('/logout')

        dispatch({type: LOGOUT_SUCCESS})
    } catch (error) {
        console.log(error);
        dispatch({type: LOGOUT_FAIL, payload: error.message})
    }
};


export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({type: UPDATE_PROFILE_REQ});

        const config = {
            withCredentials: true,
            headers: {
                 
                'Content-Type': 'multipart/form-data'
            }
        };

        const { data } = await axios.put(`/me/update`, userData, config);

        console.log('updated-profile', data);

        dispatch({type: UPDATE_PROFILE_SUCCESS, payload: data.user});



    } catch (err) {
        dispatch({type: UPDATE_PROFILE_FAILURE, payload: err.response.data.message});
    }
}


export const updatePassword = (passwords) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_PASSWORD_REQUEST });
  
    //   const config = { headers: { "Content-Type": "application/json" } };

    const config = {
        withCredentials: true,
        headers: {
             
            'Content-Type': "application/json"
        }
    };
  
      const { data } = await axios.put(
        `/password/update`,
        passwords,
        config
      );
  
      dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
    } catch (error) {
      dispatch({
        type: UPDATE_PASSWORD_FAIL,
        payload: error.message,
      });
    }
  };


  export const forgotPassword = (email) => async (dispatch) => {
    try {
      dispatch({ type: FORGOT_PASSWORD_REQUEST });

      // const formData = new FormData();
      // formData.append("email", email);
      // console.log(formData);
  
      const config = {
        
        headers: {
             
            'Content-Type': "application/json"
        }
    };



    console.log('email in actin', email)
  
      const { data } = await axios.post(`/password/forgot`, email, config);
      console.log(data);
  
      dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });

    } catch (error) {
      dispatch({
        type: FORGOT_PASSWORD_FAIL,
        payload: error.response.data.message,
      });
    }
  };




  // Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};



export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};