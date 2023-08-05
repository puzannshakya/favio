// alert('Navigation');
const btnMain = document.querySelector('.hamburger');

const body = document.body;

btnMain.addEventListener('click', () => {
    console.log('hamburger selected');
    document.body.classList.toggle('menu-mobile-active')
})




function  navigate_back_home(){
    window.location.href = sessionStorage.getItem("firsturl");
}