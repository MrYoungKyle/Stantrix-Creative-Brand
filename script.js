// ========================================
// TALENT POOL
// MAIN JAVASCRIPT
// ========================================


// ========================================
// SETTINGS
// ========================================

// Default year when the website opens
let currentYear = "2026";

// Stores the currently loaded spreadsheet
let spreadsheetData = [];

// Current pagination page
let currentPage = 1;

// Number of talents displayed per page
const rowsPerPage = 20;


// ========================================
// STANDARD COLUMN WIDTHS
// ========================================

// These widths stay the same across all years

const columnWidths = {

    "name": "220px",

    "email": "280px",

    "phone": "170px",

    "position": "220px",

    "status": "150px",

    // Any column not listed above
    "default": "180px"

};


// ========================================
// GET EXCEL FILE PATH
// ========================================

function getExcelPath() {

    return `./data/${currentYear}.xlsx`;

}


// ========================================
// LOAD EXCEL FILE
// ========================================

async function loadExcelFile() {

    const excelFilePath =
        getExcelPath();


    const tableBody =
        document.getElementById(
            "tableBody"
        );


    const tableHead =
        document.getElementById(
            "tableHead"
        );


    const pagination =
        document.getElementById(
            "pagination"
        );


    const paginationInfo =
        document.getElementById(
            "paginationInfo"
        );


    // Clear previous table

    tableHead.innerHTML = "";

    tableBody.innerHTML = "";

    pagination.innerHTML = "";


    paginationInfo.textContent =
        "Loading...";


    // Loading message

    tableBody.innerHTML = `
        <tr>
            <td class="loading-message">
                Loading ${currentYear}...
            </td>
        </tr>
    `;


    console.log(
        "Loading Excel file:",
        excelFilePath
    );


    try {

        // ========================================
        // CHECK XLSX LIBRARY
        // ========================================

        if (
            typeof XLSX === "undefined"
        ) {

            throw new Error(
                "xlsx.full.min.js is not loaded."
            );

        }


        // ========================================
        // FETCH EXCEL FILE
        // ========================================

        const response =
            await fetch(
                excelFilePath
            );


        if (!response.ok) {

            throw new Error(
                `Could not load ${currentYear}.xlsx. HTTP status: ${response.status}`
            );

        }


        console.log(
            "Excel file found:",
            excelFilePath
        );


        // ========================================
        // CONVERT FILE TO ARRAY BUFFER
        // ========================================

        const arrayBuffer =
            await response.arrayBuffer();


        console.log(
            "Excel file downloaded successfully."
        );


        // ========================================
        // READ WORKBOOK
        // ========================================

        const workbook =
            XLSX.read(
                arrayBuffer,
                {
                    type: "array"
                }
            );


        console.log(
            "Workbook opened successfully."
        );


        // ========================================
        // GET FIRST SHEET
        // ========================================

        if (
            !workbook.SheetNames ||
            workbook.SheetNames.length === 0
        ) {

            throw new Error(
                "The Excel file does not contain a worksheet."
            );

        }


        const sheetName =
            workbook.SheetNames[0];


        const worksheet =
            workbook.Sheets[
                sheetName
            ];


        console.log(
            "Using worksheet:",
            sheetName
        );


        // ========================================
        // CONVERT EXCEL TO JSON
        // ========================================

        spreadsheetData =
            XLSX.utils.sheet_to_json(
                worksheet,
                {

                    // Empty cells become ""
                    defval: "",

                    // Read displayed Excel values
                    // instead of raw numeric values
                    raw: false

                }
            );


        console.log(
            "Rows loaded:",
            spreadsheetData.length
        );


        console.log(
            "Spreadsheet data:",
            spreadsheetData
        );


        // ========================================
        // RESET PAGE
        // ========================================

        currentPage = 1;


        // ========================================
        // DISPLAY TABLE
        // ========================================

        displayTable(
            spreadsheetData
        );


    } catch (error) {

        console.error(
            "EXCEL ERROR:",
            error
        );


        // ========================================
        // DISPLAY ERROR
        // ========================================

        tableHead.innerHTML = "";


        tableBody.innerHTML = `
            <tr>
                <td class="error">

                    <strong>
                        Unable to load the Excel spreadsheet.
                    </strong>

                    <br><br>

                    ${error.message}

                </td>
            </tr>
        `;


        paginationInfo.textContent =
            "Showing 0 of 0";


        pagination.innerHTML = "";

    }

}


// ========================================
// GET COLUMN WIDTH
// ========================================

function getColumnWidth(columnName) {

    const normalizedColumn =
        columnName
            .toLowerCase()
            .trim();


    return (
        columnWidths[
            normalizedColumn
        ] ||
        columnWidths.default
    );

}


// ========================================
// DISPLAY TABLE
// ========================================

function displayTable(data) {

    const tableHead =
        document.getElementById(
            "tableHead"
        );


    const tableBody =
        document.getElementById(
            "tableBody"
        );


    const pagination =
        document.getElementById(
            "pagination"
        );


    const paginationInfo =
        document.getElementById(
            "paginationInfo"
        );


    // ========================================
    // CLEAR OLD CONTENT
    // ========================================

    tableHead.innerHTML = "";

    tableBody.innerHTML = "";

    pagination.innerHTML = "";


    // ========================================
    // CHECK FOR EMPTY DATA
    // ========================================

    if (
        !data ||
        data.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td class="empty">
                    No talent found.
                </td>
            </tr>
        `;


        paginationInfo.textContent =
            "Showing 0 of 0";


        return;

    }


    // ========================================
    // GET COLUMN NAMES
    // ========================================

    const columns =
        Object.keys(
            data[0]
        );


    // ========================================
    // CREATE HEADER ROW
    // ========================================

    const headerRow =
        document.createElement(
            "tr"
        );


    columns.forEach(
        column => {

            const th =
                document.createElement(
                    "th"
                );


            // Display column name

            th.textContent =
                column;


            // Get standard width

            const width =
                getColumnWidth(
                    column
                );


            // Apply fixed width

            th.style.width =
                width;

            th.style.minWidth =
                width;

            th.style.maxWidth =
                width;


            headerRow.appendChild(
                th
            );

        }
    );


    tableHead.appendChild(
        headerRow
    );


    // ========================================
    // CALCULATE TOTAL PAGES
    // ========================================

    const totalRecords =
        data.length;


    const totalPages =
        Math.ceil(
            totalRecords /
            rowsPerPage
        );


    // ========================================
    // MAKE SURE PAGE IS VALID
    // ========================================

    if (
        currentPage >
        totalPages
    ) {

        currentPage =
            totalPages;

    }


    if (
        currentPage < 1
    ) {

        currentPage = 1;

    }


    // ========================================
    // CALCULATE RECORD RANGE
    // ========================================

    const startIndex =
        (
            currentPage - 1
        ) *
        rowsPerPage;


    const endIndex =
        Math.min(
            startIndex +
            rowsPerPage,
            totalRecords
        );


    // ========================================
    // GET CURRENT PAGE DATA
    // ========================================

    const pageData =
        data.slice(
            startIndex,
            endIndex
        );


    // ========================================
    // DISPLAY ROWS
    // ========================================

    pageData.forEach(
        row => {

            const tableRow =
                document.createElement(
                    "tr"
                );


            columns.forEach(
                column => {

                    const td =
                        document.createElement(
                            "td"
                        );


                    // Get cell value

                    let value =
                        row[column];


                    // Prevent undefined/null

                    if (
                        value === null ||
                        value === undefined
                    ) {

                        value = "";

                    }


                    // Convert to string

                    td.textContent =
                        String(value);


                    // Get standard width

                    const width =
                        getColumnWidth(
                            column
                        );


                    // Apply same width
                    // as the header

                    td.style.width =
                        width;

                    td.style.minWidth =
                        width;

                    td.style.maxWidth =
                        width;


                    tableRow.appendChild(
                        td
                    );

                }
            );


            tableBody.appendChild(
                tableRow
            );

        }
    );


    // ========================================
    // PAGINATION INFORMATION
    // ========================================

    paginationInfo.textContent =
        `Showing ${startIndex + 1}–${endIndex} of ${totalRecords}`;


    // ========================================
    // CREATE PAGINATION
    // ========================================

    createPagination(
        totalPages,
        data
    );

}


// ========================================
// CREATE PAGINATION
// ========================================

function createPagination(
    totalPages,
    data
) {

    const pagination =
        document.getElementById(
            "pagination"
        );


    pagination.innerHTML = "";


    // ========================================
    // ONLY SHOW PAGINATION IF NECESSARY
    // ========================================

    if (
        totalPages <= 1
    ) {

        return;

    }


    // ========================================
    // PREVIOUS BUTTON
    // ========================================

    const previousButton =
        document.createElement(
            "button"
        );


    previousButton.textContent =
        "Previous";


    previousButton.disabled =
        currentPage === 1;


    previousButton.addEventListener(
        "click",
        function() {

            if (
                currentPage > 1
            ) {

                currentPage--;

                displayTable(
                    data
                );

                scrollToTable();

            }

        }
    );


    pagination.appendChild(
        previousButton
    );


    // ========================================
    // PAGE NUMBERS
    // ========================================

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        // ========================================
        // SHOW RELEVANT PAGE NUMBERS
        // ========================================

        if (
            page === 1 ||
            page === totalPages ||
            Math.abs(
                page - currentPage
            ) <= 2
        ) {

            const pageButton =
                document.createElement(
                    "button"
                );


            pageButton.textContent =
                page;


            // Highlight current page

            if (
                page === currentPage
            ) {

                pageButton.classList.add(
                    "active"
                );

            }


            pageButton.addEventListener(
                "click",
                function() {

                    currentPage =
                        page;


                    displayTable(
                        data
                    );


                    scrollToTable();

                }
            );


            pagination.appendChild(
                pageButton
            );

        }


        // ========================================
        // ADD FIRST ELLIPSIS
        // ========================================

        if (
            page === 2 &&
            currentPage > 4
        ) {

            addDots();

        }


        // ========================================
        // ADD LAST ELLIPSIS
        // ========================================

        if (
            page ===
                totalPages - 1 &&
            currentPage <
                totalPages - 3
        ) {

            addDots();

        }

    }


    // ========================================
    // NEXT BUTTON
    // ========================================

    const nextButton =
        document.createElement(
            "button"
        );


    nextButton.textContent =
        "Next";


    nextButton.disabled =
        currentPage === totalPages;


    nextButton.addEventListener(
        "click",
        function() {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                displayTable(
                    data
                );

                scrollToTable();

            }

        }
    );


    pagination.appendChild(
        nextButton
    );


    // ========================================
    // ADD DOTS
    // ========================================

    function addDots() {

        const dots =
            document.createElement(
                "span"
            );


        dots.className =
            "dots";


        dots.textContent =
            "...";


        pagination.appendChild(
            dots
        );

    }

}


// ========================================
// SCROLL BACK TO TABLE
// ========================================

function scrollToTable() {

    const table =
        document.querySelector(
            ".table-wrapper"
        );


    if (!table) {

        return;

    }


    const tablePosition =
        table.getBoundingClientRect()
            .top +
        window.scrollY -
        20;


    window.scrollTo(
        {
            top: tablePosition,
            behavior: "smooth"
        }
    );

}


// ========================================
// YEAR TABS
// ========================================

document
    .querySelectorAll(
        ".year-tab"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    // ========================================
                    // REMOVE ACTIVE STATE
                    // ========================================

                    document
                        .querySelectorAll(
                            ".year-tab"
                        )
                        .forEach(
                            tab => {

                                tab.classList.remove(
                                    "active"
                                );

                            }
                        );


                    // ========================================
                    // ACTIVATE SELECTED YEAR
                    // ========================================

                    this.classList.add(
                        "active"
                    );


                    // ========================================
                    // UPDATE YEAR
                    // ========================================

                    currentYear =
                        this.dataset.year;


                    // ========================================
                    // RESET PAGE
                    // ========================================

                    currentPage = 1;


                    // ========================================
                    // CLEAR SEARCH
                    // ========================================

                    const searchInput =
                        document.getElementById(
                            "searchInput"
                        );


                    if (
                        searchInput
                    ) {

                        searchInput.value =
                            "";

                    }


                    // ========================================
                    // LOAD NEW EXCEL FILE
                    // ========================================

                    loadExcelFile();

                }
            );

        }
    );


// ========================================
// SEARCH
// ========================================

const searchInput =
    document.getElementById(
        "searchInput"
    );


if (
    searchInput
) {

    searchInput.addEventListener(
        "input",
        function() {

            // ========================================
            // GET SEARCH VALUE
            // ========================================

            const searchValue =
                this.value
                    .toLowerCase()
                    .trim();


            // ========================================
            // FILTER DATA
            // ========================================

            const filteredData =
                spreadsheetData.filter(
                    row => {

                        return Object
                            .values(row)
                            .some(
                                value => {

                                    return String(
                                        value
                                    )
                                    .toLowerCase()
                                    .includes(
                                        searchValue
                                    );

                                }
                            );

                    }
                );


            // ========================================
            // RESET PAGE
            // ========================================

            currentPage = 1;


            // ========================================
            // DISPLAY SEARCH RESULTS
            // ========================================

            displayTable(
                filteredData
            );

        }
    );

}


// ========================================
// INITIAL LOAD
// ========================================

loadExcelFile();