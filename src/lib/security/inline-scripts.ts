// Authored HTML injected before hydration; never runtime or user input.
export const PREPAINT_SCRIPT =
  'try{var d=document.documentElement;if(sessionStorage.v)d.dataset.visited="";sessionStorage.v=1;d.lang="en";var r=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.classList.remove("light","dark");d.classList.add(r);d.style.colorScheme=r}catch(e){}'
