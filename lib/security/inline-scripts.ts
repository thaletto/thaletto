export const PREPAINT_SCRIPT =
  'try{var d=document.documentElement;if(sessionStorage.v)d.dataset.visited="";sessionStorage.v=1;d.dataset.locale="en";d.lang="en";var t=localStorage.theme||"system",r=t==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;if(r==="light"||r==="dark"){d.classList.remove("light","dark");d.classList.add(r);d.style.colorScheme=r}}catch(e){}'
