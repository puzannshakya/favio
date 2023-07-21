const btnMain = document.querySelector('.hamburger');

const body = document.body;

btnMain.addEventListener('click', () => {
    document.body.classList.toggle('menu-mobile-active')
})





const firsturl =  sessionStorage.getItem("firsturl");

function navigate_back(){
    const previousPage = document.referrer;
    console.log(previousPage);
    const isFromSettingPage = previousPage.includes('settings.html');
   
if (isFromSettingPage) {
    window.location.href = './../../pages/settings/settings.html';
    } 
else{
    window.location.href = firsturl;
}
}

function  navigate_back_home(){
    window.location.href = firsturl;
}