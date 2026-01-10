
export function unauthorized(code){
    if(code===401){
        sessionStorage.clear();
        localStorage.clear();
        window.location.href="/login"
    }
}

export function setEmail(email){
    sessionStorage.setItem("email",email)
}

export function getEmail(){
  return sessionStorage.getItem("email")
}

// Clear email from sessionStorage
export function clearEmail() {
  sessionStorage.removeItem("email");
}

// Optional: Check if email exists
export function hasEmail() {
  return sessionStorage.getItem("email") !== null;
}
