export const shortendString  = (title:string) => {
  console.log(title, 'title')
  if(title.length > 15) {
    return title.trim().substring(0, 15);
  } else {
    return title;
  }
 }
