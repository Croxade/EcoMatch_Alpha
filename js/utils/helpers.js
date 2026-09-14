export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function rupiah(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

export function toast(t) {
  const x = $("#toast");
  x.textContent = t;
  x.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => {
    x.classList.remove("show");
  }, 2200);
}