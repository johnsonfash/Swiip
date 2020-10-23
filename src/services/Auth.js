/* eslint-disable linebreak-style */

// @desc  Use secure-ls to store sensitive data in the local storage. It encrypts the data.
// @use   Instead of localStorage, use ls.
// @ex.   Check this file for examples.
import SecureLS from 'secure-ls';
const ls = new SecureLS({ encodingType: 'aes' });


const getDuration = () => {
  if (sessionStorage.getItem("swiipDuration")) {
    return 'session';
  } else {
    return 'local';
  }
}

// export const isAuthEmail = () => ls.get('swiipEmail');
// export const isAuthUserType = () => ls.get('swiipUserType');

export const getAuthEmail = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("swiipEmail");
  } else {
    return ls.get('swiipEmail');
  }
};

export const getAuthID = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("swiipID");
  } else {
    return ls.get('swiipID');
  }
};

export const getAuthUserType = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("swiipUserType");
  } else {
    return ls.get('swiipUserType');
  }
};

export const getAuthToken = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("swiipToken");
  } else {
    return ls.get('swiipToken');
  }
};

export const getAuthLatLng = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("swiipLatLng");
  } else {
    return ls.get('swiipLatLng');
  }
};

export const getAuthName = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("swiipName");
  } else {
    return ls.get('swiipName');
  }
};

export const getAuthImage = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("swiipImage");
  } else {
    return ls.get('swiipImage');
  }
};

export const setAuthImage = (image) => {
  if (getDuration() === 'session') {
    sessionStorage.setItem("swiipImage", image);
  } else {
    ls.set('swiipImage', image);
  }
}

export const setAuthName = (name) => {
  if (getDuration() === 'session') {
    sessionStorage.setItem("swiipName", name);
  } else {
    ls.set('swiipName', name);
  }
}

export const setAuthLatLng = (latLng) => {
  if (getDuration() === 'session') {
    sessionStorage.setItem("swiipLatLng", latLng);
  } else {
    ls.set('swiipName', latLng);
  }
}


export const getOrderQty = () => {
  return localStorage.getItem('swiipOrderQty');
};

export const setOrderQty = (orderQty) => {
  localStorage.setItem('swiipOrderQty', orderQty);
}

// export const getAuthorizationHeader = () => `Bearer ${isAuthenticated()}`;


export const signOut = () => {
  removeAuthState();
  window.location.reload(true);
}

export const getAuthUserAll = () => {
  if (getDuration() === 'session') {
    return {
      id: sessionStorage.getItem("swiipID"),
      name: sessionStorage.getItem("swiipName"),
      findBy: sessionStorage.getItem("swiipEmail"),
      user_type: sessionStorage.getItem("swiipUserType"),
      token: sessionStorage.getItem("swiipToken")
    }
  } else {
    return {
      id: ls.get("swiipID"),
      name: ls.get("swiipName"),
      findBy: ls.get("swiipEmail"),
      user_type: ls.get('swiipUserType'),
      token: ls.get('swiipToken')
    }
  }
}


export const removeAuthState = () => {
  ls.removeAll();
  sessionStorage.clear();
  localStorage.clear();
};

export const setAuthToken = (token) => {
  if (getDuration() === 'session') {
    sessionStorage.setItem("swiipToken", token);
  } else {
    ls.set('swiipToken', token);
  }
}

export const authenticateUser = (id, name, email, userType, token, image, latLng, duration) => {
  if (duration === 'session') {
    sessionStorage.setItem("swiipID", id);
    sessionStorage.setItem("swiipName", name);
    sessionStorage.setItem("swiipEmail", email);
    sessionStorage.setItem("swiipUserType", userType);
    sessionStorage.setItem("swiipToken", token);
    sessionStorage.setItem("swiipImage", image);
    sessionStorage.setItem("swiipLatLng", latLng);
    sessionStorage.setItem("swiipDuration", duration);
  } else {
    ls.set("swiipID", id);
    ls.set("swiipName", name);
    ls.set("swiipEmail", email);
    ls.set('swiipUserType', userType);
    ls.set('swiipToken', token);
    ls.set('swiipImage', image);
    ls.set('swiipLatLng', latLng);
    ls.set('swiipDuration', duration);
  }
};

// export default {
//   isAuthEmail,
//   removeAuthenticatedState,
//   authenticateUser
// };
export default {
  getAuthEmail,
  getAuthUserType,
  getAuthToken,
  getOrderQty,
  getAuthName,
  getAuthLatLng,
  setAuthLatLng,
  setAuthName,
  signOut,
  getAuthImage,
  setAuthImage,
  getAuthID,
  getAuthUserAll,
  setOrderQty,
  setAuthToken,
  removeAuthState,
  authenticateUser
};
