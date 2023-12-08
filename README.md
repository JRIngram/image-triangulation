# Image Triangulation
Image Triangulation is a webapp that "triangulates" images. It turns image from standard images you upload, into a series of triangles. Each pixel in each triangle is reassigned the value of the average pixel value of all pixels within its triangle. This makes the image seem like it's built out of a series of triangles, like below.

// ADD IMAGES

Image Triangulation has two parts, the server and the client. 

The client is built using: [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/) and [Chakra-UI](https://chakra-ui.com/).

The server is built using: [Node.js](https://nodejs.org/en), [Express.js](http://expressjs.com/), [SQLite](https://www.sqlite.org/index.html) and [TypeScript](https://www.typescriptlang.org/)

## Installing and Running
You will need both the server and client running to use this webapp.

### Client
To install dependencies for the client, change to the `image-triangulation-client` directory and run `npm i`.

Once you have installed the dependencies to run in dev mode run: `npm run dev`.

To run the client in production mode, run:
```sh
npm run build
npm run start
```

### Server
To install dependencies for the server, change to the `server` directory and run `npm i`.

Then run `npm run start`.

Upon running an SQLite database is creted in the `server/tmp/` directory. Images that are uploaded to the server are stored within `server/file`. Do not remove images from the files directory.

To reset / wipe the files and database, run `npm run reset`

## How it works
The image triangulation webapp works by taking an image and running the following pipeline:
1. Blur the image, using a given blur radius and a Gaussian blur.
2. Greyscale the blurred image
3. Run an edge detection algorithm on the image, using a sobel filter.
4. Run a thresholding algorithm to produce an image that includes only edges as it's pixels. Each pixel is either white (background) or black (foreground) once this algorithm is completed. This is done using the niblack algorithm.
5. Take the black pixels and their coordinates from the previous step and use these as the input for a Delaunay triangulation. Delaunay triangulation is performed using the Bowyer-Watson algorithm.
6. For each pixel in the _original_ image, check which triangle in the triangulation it belongs to. 
7. For each triangle calculate the mean pixel value from each pixel in the triangle.
8. For each pixel, assign it the mean pixel value for the triangle to which it belongs.

This whole pipeline can be quite intensive and take a long time to run. Two things can be done to speed up the performance, however this will be at the cost of quality of the image at the end:
- Increase the _blur radius_: This affects the Gaussian Blur. A large blur radius makes the image that is processed more blurry, resulting in less edges to process but also will mean there are less triangles.
- Increase the _Niblack K_ value: K is a constant used in the Niblack thresholding algorithm. A lower K makes the algorithm more permissive, meaning it considers more pixels to be in the foreground. Therefore a higher K values leads to less foreground pixels which results in less pixels to process and therefore less triangles.


