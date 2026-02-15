// import * as FileSystem from "expo-file-system";

// const CLOUD_NAME = "dqwjxtgbt";
// const UPLOAD_PRESET = "Storemate";

// export const uploadToCloudinary = async (imageUri: string) => {
//   const base64 = await FileSystem.readAsStringAsync(imageUri, {
//     encoding: FileSystem.EncodingType.Base64,
//   });

//   const data = {
//     file: `data:image/jpeg;base64,${base64}`,
//     upload_preset: UPLOAD_PRESET,
//   };

//   const res = await fetch(
//     `https://api.cloudinary.com/v1_1/${dqwjxtgbt}/image/upload`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     }
//   );

//   const json = await res.json();
//   return json.secure_url as string;
// };

import * as FileSystem from 'expo-file-system';

const CLOUD_NAME = "dqwjxtgbt";
const UPLOAD_PRESET = "Storemate";

export const uploadToCloudinary = async (uri: string): Promise<string> => {
  console.log('Starting upload for URI:', uri);
  
  // Method 1: Try FormData approach first
  try {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'upload.jpg';
    
    formData.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: filename,
    } as any);
    
    formData.append('upload_preset', UPLOAD_PRESET!);

    console.log('Trying FormData upload...');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = await response.json();
    
    if (response.ok) {
      console.log('FormData upload successful, URL:', data.secure_url);
      return data.secure_url;
    }
    
    console.log('FormData upload failed, trying base64 method...');
  } catch (formDataError) {
    console.log('FormData error, trying base64 method...', formDataError);
  }
  
  // Method 2: Try base64 approach as fallback
  try {
    console.log('Trying base64 upload...');
    
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create form data
    const formData = new FormData();
    formData.append('file', `data:image/jpeg;base64,${base64}`);
    formData.append('upload_preset', UPLOAD_PRESET!);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    console.log('Base64 upload successful, URL:', data.secure_url);
    return data.secure_url;
  } catch (base64Error) {
    console.error('Both upload methods failed:', base64Error);
    throw base64Error;
  }
};