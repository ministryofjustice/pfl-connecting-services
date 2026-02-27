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

window.onload = function () {
  var printLinks = document.querySelectorAll('.js-print-link');
  printLinks.forEach(function (link) {
    link.removeAttribute('hidden');
    link.addEventListener('click', function () {
      window.print();
    });
  });
};
