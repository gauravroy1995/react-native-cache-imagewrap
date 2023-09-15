# react-native-cache-imagewrap

Cached Image component for react native

This packages uses 2 peer dependencies :

#### @react-native-async-storage/async-storage

and

#### react-native-blob-util

## Versions

Currently it supports

react-native-blob-util version `0.17.0` and react native `0.65` and up.

## Installation

    npm install react-native-cache-imagewrap --save
    - or -
    yarn add react-native-cache-imagewrap

We use [`react-native-blob-util`](https://github.com/RonRadtke/react-native-blob-util) and [`@react-native-async-storage/async-storage`] to handle file system access in this package and it requires an extra step during the installation.

## Peer dependency installation

    yarn add react-native-blob-util @react-native-async-storage/async-storage

## Usage

`CachedImage`

CachedImage is a component that fetches and caches images in AsyncStorage for efficient rendering. You can use it as follows:

```jsx
import { CachedImage } from "react-native-cache-imagewrap";

const YourComponent = () => {
  const imageUri = "https://example.com/your-image.jpg";

  return (
    <CachedImage
      uri={imageUri}
      cache={true} // Enable caching (default is true)
      imgProps={{ style: { width: 200, height: 200 } }} // ImageProps for customization
      retryCount={3} // Number of automatic retry attempts (default is 1)
    />
  );
};
```

| Prop Name   | Type                      | Default Value | Description                                         |
| ----------- | ------------------------- | ------------- | --------------------------------------------------- |
| uri         | string                    | N/A           | The URI of the image to be displayed.               |
| cache       | boolean                   | true          | Enable or disable image caching.                    |
| headers     | { [key: string]: string } | {}            | HTTP headers for fetching the image.                |
| requestType | "GET" \| "POST"           | "GET"         | HTTP request type for fetching the image.           |
| imgProps    | ImageProps                | {}            | ImageProps for customization (e.g., width, height). |
| retryCount  | number                    | 1             | Number of automatic retry attempts.                 |

`deleteCache`

deleteCache is a function to delete a cached image from AsyncStorage. You can use it like this:

```jsx
import { deleteCache } from "react-native-cache-image";

const imageUri = "https://example.com/your-image.jpg";

async function deleteCachedImage() {
  try {
    const result = await deleteCache(imageUri);
    console.log(result); // "cache deleted" if successful
  } catch (error) {
    console.error("Error deleting cache:", error);
  }
}

// Call the function to delete the cached image
deleteCachedImage();
```

`prefetchImage`

prefetchImage is a function for prefetching and caching images in AsyncStorage for later use. You can use it like this:

```jsx
import { prefetchImage } from "react-native-cache-image";

const imageUri = "https://example.com/your-image.jpg";

async function prefetchAndCacheImage() {
  try {
    await prefetchImage({ uri: imageUri });
    console.log("Image prefetched and cached successfully");
  } catch (error) {
    console.error("Error prefetching image:", error);
  }
}

// Call the function to prefetch and cache the image
prefetchAndCacheImage();
```
