const setupPrintThisPage = () => {
    function printPage() {
        window.print();
    }

    const printThisPageButton = document.getElementById('print-this-page-button');
    if (printThisPageButton) {
        printThisPageButton.addEventListener('click', () => printPage());
    }
}

export default setupPrintThisPage;
