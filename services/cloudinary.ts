import * as FileSystem from "expo-file-system";

const CLOUD_NAME = "dqwjxtgbt";
const UPLOAD_PRESET = "Storemate";

export const uploadToCloudinary = async (imageUri: string) => {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const data = {
    file: `data:image/jpeg;base64,${base64}`,
    upload_preset: UPLOAD_PRESET,
  };

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${dqwjxtgbt}/image/upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();
  return json.secure_url as string;
};
