export const postImage = async (formData: FormData) =>
  await fetch("http://localhost:3001/image", {
    method: "post",
    body: formData,
  });

export const triggerTriangulation = async (imageId: number) =>
  await fetch(`http://localhost:3001/image/${imageId}`, {
    method: "put",
  });

export const getOriginalImage = async (imageId: number) =>
  await fetch(`http://localhost:3001/image/${imageId}/original`, {
    method: "get",
  });

export const getTriangulatedImage = async (imageId: number) =>
  await fetch(`http://localhost:3001/image/${imageId}/triangulated`, {
    method: "get",
  });

export const getTriangulationStatus = async (imageId: number) =>
  await fetch(`http://localhost:3001/image/${imageId}/status`, {
    method: "get",
  });
