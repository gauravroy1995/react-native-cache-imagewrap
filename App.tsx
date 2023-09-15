import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, ImageProps } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";

export type CachedImageProps = {
  uri: string;
  cache?: boolean;
  headers?: { [key: string]: string };
  requestType?: "GET" | "POST";
  imgProps?: ImageProps;
  retryCount?: number; // Added retry count prop
};

export const CachedImage: React.FC<CachedImageProps> = ({
  uri,
  cache = true,
  headers = {},
  requestType = "GET",
  imgProps = {},
  retryCount = 1, // Default retry count is 3
}) => {
  const [base64Image, setBase64Image] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndCacheImage = async (attempt: number = 1) => {
      try {
        if (cache) {
          // Check if the image is already cached
          const cachedImage = await AsyncStorage.getItem(uri);

          if (cachedImage) {
            // If cached, use the cached image
            setBase64Image(cachedImage);
          } else if (cache) {
            // If not cached and caching is enabled, fetch the image
            const response = await ReactNativeBlobUtil.fetch(
              requestType,
              uri,
              headers
            );
            const base64Data = await response.base64();

            // Store the image in AsyncStorage
            await AsyncStorage.setItem(uri, base64Data);

            // Set the base64 image for rendering
            setBase64Image(base64Data);
          }
        }
      } catch (error) {
        console.error(
          `Error fetching or caching image (Attempt ${attempt}):`,
          error
        );

        // Retry if there are remaining attempts
        if (attempt < retryCount) {
          fetchAndCacheImage(attempt + 1);
        }
      }
    };

    fetchAndCacheImage();
  }, [cache, uri, headers, requestType, retryCount]);

  const sourceUri =
    cache && base64Image ? `data:image/jpeg;base64,${base64Image}` : uri;

  return <Image source={{ uri: sourceUri }} {...imgProps} />;
};

export const deleteCache = async (uri: string) => {
  try {
    await AsyncStorage.removeItem(uri);
  } catch (e) {
    console.log(e, "Error in deleting cached");
    throw e;
    // remove error
  }

  return "cache deleted";
};

export type prefetchImageProps = {
  uri: string;
  requestType?: "GET" | "POST";
  headers?: { [key: string]: string };
};

export const prefetchImage = async (props: prefetchImageProps) => {
  const { uri, requestType = "GET", headers = {} } = props || {};
  try {
    // Check if the image is already cached
    const cachedImage = await AsyncStorage.getItem(uri);

    if (!cachedImage) {
      // If not cached, fetch the image
      const response = await ReactNativeBlobUtil.fetch(
        requestType,
        uri,
        headers
      );
      const base64Data = await response.base64();

      // Store the image in AsyncStorage
      await AsyncStorage.setItem(uri, base64Data);
    }
  } catch (error) {
    console.error("Error prefetching image:", error);
    throw error;
  }
};
