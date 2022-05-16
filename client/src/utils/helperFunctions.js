import { toast } from 'react-toastify';
import { MessageType } from '../constants/Message';
import { logoutSuccess } from '../redux/actions/auth';

export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)?.toLowerCase()}`;
}

export function getCharacterName(name) {
  if (!name) return '';
  const [firstName, lastName] = name.split(' ');
  const [firstChar] = firstName;
  const secondChar = lastName ? lastName[0] : firstName[1];
  return `${firstChar.toUpperCase()}${secondChar.toLowerCase()}`;
}

export function handleError(err, callback) {
  if (!err.response) return callback({ message: err.message }, err);

  const { status, data } = err.response;
  if (status === 401) {
    toast.error('Session expired, Please log in again');
    return logoutSuccess();
  }
  return callback(data.error, err);
}

export function handleEnter(callback) {
  return (e) => {
    if (e.key === 'Enter') {
      callback(e);
    }
  };
}

export const stopPropagation = (e) => e.stopPropagation();

export const formatDate = (date) => {
  const today = new Date(date);
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;

  return `${dd}/${mm}/${yyyy}`;
};

export const sameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate();
};

export const formatDateWithMonth = (date) => {
  const formattedDate = new Date(date)
    .toLocaleDateString({},
      {
        month: 'long', day: '2-digit', year: 'numeric', // timeZone: 'UTC',
      });
  return formattedDate;
};

export const getTime = (date) => {
  const timeString = new Date(date).toLocaleTimeString();
  const [time, meridiem] = timeString.split(' ');
  const slicedTime = time.slice(0, time.lastIndexOf(':'));
  return `${slicedTime} ${meridiem}`;
};

export const scrollToBottom = (element) => {
  if (!element) return;
  // eslint-disable-next-line no-param-reassign
  element.scrollTop = element.scrollHeight;
};

export const reachedThresholdTop = (event, threshold = 0) => {
  const { scrollTop } = event.target;

  if (scrollTop <= threshold) return true;
  return false;
};

export const reachedThresholdBottom = (scrollPositionData, threshold = 3) => {
  const { scrollHeight, scrollTop, clientHeight } = scrollPositionData;

  return Math.abs(scrollHeight - scrollTop - clientHeight) <= threshold;
};

export const getCaret = (el) => {
  if (el.selectionStart) {
    return el.selectionStart;
  } if (document.selection) {
    el.focus();
    const r = document.selection.createRange();
    if (r === null) {
      return 0;
    }
    const re = el.createTextRange();
    const rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint('EndToStart', re);
    return rc.text.length;
  }
  return 0;
};

export const getMessageType = (file) => {
  const { type } = file;

  if (type.match('audio.*')) return MessageType.AUDIO;
  if (type.match('image.*')) return MessageType.IMAGE;
  if (type.match('video.*')) return MessageType.VIDEO;

  // for now return file
  return MessageType.FILE;
};

export const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth = 400, maxHeight = 300) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: Math.floor(srcWidth * ratio), height: Math.floor(srcHeight * ratio) };
};

// will set original dimensions
export const getFileDimensions = (file) => new Promise((resolve) => {
  const isImage = MessageType.IMAGE === file.type;
  let obj = isImage ? new Image() : document.createElement('video');

  if (isImage) {
    obj.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = obj;
      // const { width, height } = calculateAspectRatioFit(naturalWidth, naturalHeight);
      resolve(`${width} ${height}`);
      obj = null;
    };
  } else {
    obj.onloadedmetadata = () => {
      const { videoWidth: width, videoHeight: height } = obj;
      // const { width, height } = calculateAspectRatioFit(videoWidth, videoHeight);
      resolve(`${width} ${height}`);
      obj = null;
    };
  }
  obj.onerror = () => {
    resolve('400 300');
    obj = null;
  };
  obj.src = file.blobUrl;
});

export const isHostedUrl = (url) => !url.startsWith('blob:');
export const transformCloudinaryUrl = (url, width, height) => {
  if (!url) return url;
  const cloudinaryDeliveryType = 'upload/';
  const indexOfDelType = url.indexOf(cloudinaryDeliveryType);
  const indexTillSlice = indexOfDelType + cloudinaryDeliveryType.length;
  const transformations = `c_scale,h_${height},w_${width}`;
  return `${url.slice(0, indexTillSlice)}${transformations}/${url.slice(indexTillSlice)}`;
};

export const downloadFile = async (url, name) => {
  const response = await fetch(url);
  const blob = await response.blob();

  const localOriginDownloadUrl = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = localOriginDownloadUrl;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();

  URL.revokeObjectURL(localOriginDownloadUrl);
};

export function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${Math.round(bytes / 1024 ** i, 2)} ${sizes[i]}`;
}
