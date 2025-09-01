import { API } from "./API.js"

const inpUserName = /** @type {HTMLInputElement} */ (document.getElementById('userName'))
const inpPassword = /** @type {HTMLInputElement} */ (document.getElementById('passWord'))
const btnLoginButton = /** @type {HTMLButtonElement} */ (document.getElementById('loginButton'))
const outComeLabel = /** @type {HTMLParagraphElement} */ (document.getElementById('outComeLabel'))
const body = /** @type {HTMLBodyElement} */ (document.getElementById('MainBody'));



btnLoginButton.addEventListener('click', async ()=>{
  
  console.log(`${inpUserName.value} ${inpPassword.value}`)

  const [
    wasLoginSuccessful,
    loginObject
  ] = await API.Login(inpUserName.value, inpPassword.value)

  if (wasLoginSuccessful){

    body.classList.add('greenBG')
  }
  else{

    body.classList.remove('greenBG')
    outComeLabel.innerText = `Login failed: ${loginObject.message}`
  }
})
