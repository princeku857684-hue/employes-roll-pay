// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');

const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const rememberMeCheckbox = document.querySelector('.remember-me input');
const forgotPassLink = document.querySelector('.forgot-pass');
const userInput = document.getElementById('username');
const passInput = document.getElementById('password');

const payrollForm = document.getElementById('payroll-form');
const employeeTableBody = document.getElementById('employee-table-body');
const totalEmpElem = document.getElementById('total-emp');
const totalPayrollElem = document.getElementById('total-payroll');
const payslipModal = document.getElementById('payslip-modal');

// Data Array from LocalStorage
let employees = JSON.parse(localStorage.getItem('employees')) || [];

// Page Load par check karein agar koi saved username ho ("Remember Me" ke liye)
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('savedUsername');
    if (savedUser && userInput) {
        userInput.value = savedUser;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }
});

// Forgot Password Click Event
if (forgotPassLink) {
    forgotPassLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert("Admin Password Recovery:\nAapka Default Username: admin\nPassword: 1234 hai.");
    });
}

// Admin Login Logic with Remember Me & Animations
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!userInput || !passInput) return;

        const user = userInput.value.trim();
        const pass = passInput.value.trim();

        // Default Credentials check (Username: admin, Password: 1234)
        if (user === 'Prince Kumar' && pass === '12345') {
            
            // Remember Me functionality
            if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                localStorage.setItem('savedUsername', user);
            } else {
                localStorage.removeItem('savedUsername');
            }

            // Show Button Loader Animation
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline-block';

            setTimeout(() => {
                // Fade Out Login Section
                if (loginSection) loginSection.style.opacity = '0';

                setTimeout(() => {
                    if (loginSection) loginSection.style.display = 'none';
                    if (dashboardSection) dashboardSection.style.display = 'flex';
                    if (loginSection) loginSection.style.opacity = '1';
                    
                    if (btnText) btnText.style.display = 'inline-block';
                    if (btnLoader) btnLoader.style.display = 'none';
                    
                    renderEmployees();
                }, 400);

            }, 800); 
        } else {
            alert('Galat Username ya Password! (Username: admin, Password: 1234)');
        }
    });
}

// Logout Logic
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if (dashboardSection) dashboardSection.style.display = 'none';
        if (loginSection) loginSection.style.display = 'flex';
        if (loginForm) loginForm.reset();
        
        // Agar Remember Me checked nahi hai toh username field bhi clear kar dein
        if (!rememberMeCheckbox || !rememberMeCheckbox.checked) {
            if (userInput) userInput.value = '';
        }
    });
}

// 2. Employee Management & Payroll Calculation
if (payrollForm) {
    payrollForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameInput = document.getElementById('emp-name');
        const idInput = document.getElementById('emp-id');
        const deptInput = document.getElementById('emp-dept');
        const baseSalaryInput = document.getElementById('base-salary');
        const allowanceInput = document.getElementById('allowance');
        const deductionInput = document.getElementById('deduction');

        if (!nameInput || !idInput || !baseSalaryInput) return;

        const name = nameInput.value.trim();
        const id = idInput.value.trim();
        const dept = deptInput ? deptInput.value.trim() : 'General';
        const baseSalary = parseFloat(baseSalaryInput.value) || 0;
        const allowance = allowanceInput ? parseFloat(allowanceInput.value) || 0 : 0;
        const deduction = deductionInput ? parseFloat(deductionInput.value) || 0 : 0;

        // Net Salary Calculation Formula: (Base + Allowance) - Deduction
        const netSalary = (baseSalary + allowance) - deduction;

        const newEmployee = {
            id,
            name,
            dept,
            baseSalary,
            allowance,
            deduction,
            netSalary
        };

        employees.push(newEmployee);
        saveAndRender();
        payrollForm.reset();
    });
}

// 3. Render Table and Dashboard Totals
function renderEmployees() {
    if (!employeeTableBody) return;
    
    employeeTableBody.innerHTML = '';
    let totalPayroll = 0;

    employees.forEach((emp, index) => {
        totalPayroll += emp.netSalary;

        const row = document.createElement('tr');
        row.className = 'animate-row';
        row.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.dept}</td>
            <td>₹${emp.baseSalary}</td>
            <td>₹${emp.allowance}</td>
            <td>₹${emp.deduction}</td>
            <td><strong>₹${emp.netSalary}</strong></td>
            <td>
                <button class="payslip-btn" onclick="generatePayslip(${index})">Payslip</button>
                <button class="delete-btn" onclick="deleteEmployee(${index})">Delete</button>
            </td>
        `;
        employeeTableBody.appendChild(row);
    });

    if (totalEmpElem) totalEmpElem.textContent = employees.length;
    if (totalPayrollElem) totalPayrollElem.textContent = totalPayroll;
}

// 4. Payslip Generation Logic
function generatePayslip(index) {
    const emp = employees[index];
    if (!emp) return;

    const slipId = document.getElementById('slip-id');
    const slipName = document.getElementById('slip-name');
    const slipDept = document.getElementById('slip-dept');
    const slipBase = document.getElementById('slip-base');
    const slipAllowance = document.getElementById('slip-allowance');
    const slipDeduction = document.getElementById('slip-deduction');
    const slipNet = document.getElementById('slip-net');

    if (slipId) slipId.textContent = emp.id;
    if (slipName) slipName.textContent = emp.name;
    if (slipDept) slipDept.textContent = emp.dept;
    if (slipBase) slipBase.textContent = "₹" + emp.baseSalary;
    if (slipAllowance) slipAllowance.textContent = "₹" + emp.allowance;
    if (slipDeduction) slipDeduction.textContent = "₹" + emp.deduction;
    if (slipNet) slipNet.textContent = "₹" + emp.netSalary;

    if (payslipModal) payslipModal.style.display = 'flex';
}

function closePayslip() {
    if (payslipModal) payslipModal.style.display = 'none';
}

// 5. Delete Employee
function deleteEmployee(index) {
    employees.splice(index, 1);
    saveAndRender();
}

// Save data to LocalStorage
function saveAndRender() {
    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();
}