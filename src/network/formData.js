import axios from 'axios';
export const fileOptions = params => {
  let formData = new FormData();
  for (var key in params) {
    key !== 'file' &&
      key !== 'fileName' &&
      key !== 'token' &&
      formData.append(key, params[key]);
  }
  let file = {
    uri: params.file,
    type: 'image/jpg',
    name: params.fileName,
  };
  formData.append('file', file);
  if (params.token) {
    return {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
      body: formData,
    };
  } else {
    return {
      method: 'POST',
      body: formData,
    }
  }
};

export const signOptions = params => {
  let formData = new FormData();
  for (var key in params) {
    formData.append(key, params[key]);
  }
  return {
    method: 'POST',
    body: formData,
  };
};

export const editFile = (sessionId, firstName, lastName, image) =>
  new Promise((resolve, reject) => {
    var data = new FormData();
    data.append('session_id', sessionId);
    data.append('firstname', firstName);
    data.append('lastname', lastName);
    data.append('file', {
      uri: image,
      name: 'userProfile.jpg',
      type: 'image/jpg',
    });

    return axios
      .post('http://192.168.43.16:9998/api/uploadFile', data, {
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
