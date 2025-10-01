$(document).ready(function () {

    window.url_base = 'http://127.0.0.1:8000';

    window.globalPage = $('.contenuGlobal');

    window.sessionData = atob(window.themeData);
    window.session = JSON.parse(sessionData);

    window.nbreAlert = session.nbreAlert;
    window.nomRole = session.nomRole;
    window.menuRole = session.menuRole;
    window.user = session.user;

    window.emailVerif = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
});