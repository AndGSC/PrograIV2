import React from 'react';

function Footer() {
    const anioActual = new Date().getFullYear();

    return (
        <footer className="main-footer">
            <div className="footer-left">
                <p className="footer-title">Bolsa de Empleo</p>
                <p className="footer-company">Proyecto Programación IV</p>
            </div>

            <div className="footer-right">
                <p>Universidad Nacional</p>
                <p>{anioActual}</p>
            </div>
        </footer>
    );
}

export default Footer;