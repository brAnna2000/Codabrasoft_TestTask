let form = document.querySelector('form');
let firstName = form.querySelector('input[id="firstName"]');
let lastName = form.querySelector('input[id="lastName"]');
let email = form.querySelector('input[id="e-mail"]');
let day = form.querySelector('select[id="day"]');
let month = form.querySelector('select[id="month"]');
let year = form.querySelector('select[id="year"]');
let date = form.querySelector('input[id="date"]');
let password = form.querySelector('input[id="password"]');
let confirmPassword = form.querySelector('input[id="confirmPassword"]');

let fields = form.querySelectorAll('.field');
let registration = document.querySelector('.registration');
let successRegistration = document.querySelector('.successRegistration');
let validateBtn = document.querySelector('button');
let user = document.querySelector('object');
let check = document.querySelector('input[id="e-mail"]~img');

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const passw = /^(?=.*[1-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{8,}$/;

date.max = new Date().toISOString().split("T")[0];

form.addEventListener('change', function(){
    formValidate(); 
},true);

validateBtn.addEventListener('click', async function(e){
    e.preventDefault();
    if(dateValidate() && emailValidate() && !passwordValidate() && firstName.value && lastName.value){
        let data = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            date: date.value,
            password: password.value
        };
        await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .then(function (){
            registration.style.display = "none";
            successRegistration.style.display = "flex";
            user.style.width = 0;
        })
    }else{
        shakeButton();
        formValidate();
    }
})

function formValidate(){
    let passValid = passwordValidate();
    fields.forEach((field)=>{
        let span = field.nextElementSibling;
        let nameValid = nameValidate(field.value);
        if(!field.value){
            field.classList.add("error");
            span.style.display = "inline";
            span.textContent = "Пустое поле";
        }else if((field.id == "firstName" && nameValid.length) || (field.id == "lastName" && nameValid.length)){
            field.classList.add("error");
            span.style.display = "inline";
            span.textContent = nameValid;
        }
        else if(field.id == "e-mail" && !emailValidate()){
            field.classList.add("error");
            span.style.display = "inline";
            span.textContent = "Неверный e-mail";
        }else if((field.id == "password" && passValid.length) || (field.id == "confirmPassword" && passValid.length)){
            field.classList.add("error");
            if(field.id == "confirmPassword"){
               span.style.bottom =  passValid === 'Пароли не совпадают' ? '-15px' : '-45px'; 
               span.style.display = "inline";
               span.textContent = passValid; 
            }
        }else{
            field.classList.remove("error");
            span.style.display = "none";
        }
    })
}

function nameValidate(value){
    if(/[0-9]/.test(value)){
        return 'Введите данные без цифр'
    }else{
        return value.length < 2 || value.length > 25 ? "Длина от 2 до 25 символов" : '';
    }
}

function emailValidate(){
    if(email.value && EMAIL_REGEXP.test(email.value)){
        check.style.display = "block";
        return true
    }else{
        check.style.display = "none";
        return false
    }
}

function dateValidate(){
    return date.value.length;
}

function passwordValidate(){
    if(password.value != confirmPassword.value){
        return 'Пароли не совпадают'
    }else if(password.value == confirmPassword.value && !password.value.match(passw)){
        return 'Пароль от 8 символов, заглавные и строчные буквы, цифры от 1 до 9, один из символов !@#$%'
    }else if(password.value == confirmPassword.value && password.value.match(passw)){
        return ''
    }
}

function shakeButton(){
    validateBtn.classList.add('shake');
    setTimeout(() => validateBtn.classList.remove('shake'), 2000);
}