import axios from 'axios';

export const BASE_URL = 'http://localhost:8800';
export const BASE_URL_IMAGE = 'http://localhost:8800/public/img/';

const options = {
  params: {
    maxResults: 50,
  },
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
    'token': localStorage.getItem("LOGIN_USER")
  },
};



export const fetchFromAPI = async (url) => {
  const { data } = await axios.get(`${BASE_URL}/${url}`, options);
  return data;
};


export const getVideoAPI = async () => {
  const {data} = await fetchFromAPI(`video/get-video`, options);
  return data;
};


export const getVideoTypeAPI = async () => {
  const {data} = await fetchFromAPI(`video/get-video-type/`, options);
  return data;
};

export const getVideoByTypeAPI = async (typeid) => {
  const {data} = await fetchFromAPI(`video/get-video-by-type/${typeid}`, options);
  return data;
};

export const getVideoByIdAPI = async (videoid) => {
  const {data} = await fetchFromAPI(`video/get-video-id/${videoid}`, options);
  return data;
};

export const signUpAPI = async (model) => {
  const { data } = await axios.post(`${BASE_URL}/user/signup`, model, options);
  console.log(model)
  return data;
};

export const loginAPI = async (model) => {
  const { data } = await axios.post(`${BASE_URL}/user/login`, model , options);
  return data;
};


export const logiFacebooknAPI = async (model) => {
  const { data } = await axios.post(`${BASE_URL}/user/login-facebook`, model , options);
  return data;
};

export const getVideoCommentAPI = async (videoid) => {
  const { data } =  await fetchFromAPI(`video/get-comment/${videoid}`, options);
  return data;
};

export const commentAPI = async (model) => {
  const { data } = await axios.post(`${BASE_URL}/video/post-comment`, model , options);
  return data;
};

export const resetTokenApi = async () => {
  const { data } = await axios.post(`${BASE_URL}/user/reset-token`, null, options);

  return data.data;
};

export const checkEmailApi = async (model) => {
  const { data } = await axios.post(`${BASE_URL}/user/check-email`, model, options);

  return data.data;
};


export const checkCodeApi = async (model) => {
  const { data } = await axios.post(`${BASE_URL}/user/check-code`, model, options);

  return data.data;
};

export const uploadCloudApi = async (formData) => {
  const { data } = await axios.post(`https://api.cloudinary.com/v1_1/dv0ypfri1/upload`, formData);

  return data;
};

export const uploadAvatarApi = async (formData) => {
  const { data } = await axios.post(`${BASE_URL}/user/upload-avatar`, formData, options);

  return data.data;
};


export const getUserApi = async () => {
  const { data } = await axios.get(`${BASE_URL}/user/get-user`, options);

  return data.data;
};

export const getDataChat = async () => {
  const { data } = await axios.get(`${BASE_URL}/user/get-data-chat`, options);

  return data.data;
};


axios.interceptors.response.use((response) => {

  return response;
}, (error) => {

  if (error.response.data == "TokenExpiredError") {
    // gọi API reset token
    resetTokenApi().then(result => {
      localStorage.setItem("LOGIN_USER", result)
    }).catch(err => {
      localStorage.removeItem("LOGIN_USER")
    }).finally(() => {
    })
  }
  else if (error.response.status == "401") {
    localStorage.removeItem("LOGIN_USER")
  }
  return Promise.reject(error);
});