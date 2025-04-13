export const shortendString  = (title:string) => {
  if(title.length > 15) {
    return title.trim().substring(0, 15);
  } else {
    return title;
  }
 }
