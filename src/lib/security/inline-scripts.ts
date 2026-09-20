// Inline bootstrapping injected into <head> (see site-document and the
// global error shells). Runs before hydration from the authored HTML string,
// never from user input: marks the session as visited and applies the system
// theme to <html> so the first paint has no flash of unstyled content.
export const PREPAINT_SCRIPT =
  'try{var d=document.documentElement;if(sessionStorage.v)d.dataset.visited="";sessionStorage.v=1;d.lang="en";var r=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.classList.remove("light","dark");d.classList.add(r);d.style.colorScheme=r}catch(e){}'
