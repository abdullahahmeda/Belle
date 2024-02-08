const sheetId = "1q3M1Etd73E7s3HaH_SZyEwBAZUCbAY_nhjmB02WDoTc";
const Script =
  "https://script.google.com/macros/s/AKfycbzHoNFrA-opvU2vcQ4aw_xMz930zURNXK_XUJQ917n_vJVG8FdZNm2z2AuRkDowCR1KkQ/exec";
const base = `${Script}?`;
let query = encodeURIComponent("Select *");
let PlacesSheetName = "places";
let PlacesUrl = `${base}sheet=${PlacesSheetName}&tq=${query}`;
let Dataplaces = [];
let InvoicesSheetName = "Data0";
let InvoicesUrl = `${base}sheet=${InvoicesSheetName}&tq=${query}`;
let InvoicesData = [];
let MethodSheetName = "Data1";
let MethodUrl = `${base}sheet=${MethodSheetName}&tq=${query}`;
let DataPaymentMethods = [];
let TahseelSheetName = "Tahseel";
let TahseelUrl = `${base}sheet=${TahseelSheetName}&tq=${query}`;
let DataTahseel = [];
let TahseelTypesSheetName = "TahseelType";
let TahseelTypesUrl = `${base}sheet=${TahseelTypesSheetName}&tq=${query}`;
let DataTahseelTypes = [];
let ExpenseTypesSheetName = "ExpenseType";
let ExpenseTypesUrl = `${base}sheet=${ExpenseTypesSheetName}&tq=${query}`;
let DataExpenseTypes = [];
let ExpensesSheetName = "Expense";
let ExpensesUrl = `${base}sheet=${ExpensesSheetName}&tq=${query}`;
let DataExpenses = [];
let SettingSheetName = "Setting";
let SettingUrl = `${base}sheet=${SettingSheetName}&tq=${query}`;
let DataSetting = [];

document.addEventListener("DOMContentLoaded", init);
function init() {
  // ConvertMode();
  if (typeof Storage !== "undefined") {
    ShowSelectForm("Main");
    let Loading = document.getElementById("LoadingMain");
    Loading.className = "fa fa-refresh fa-spin";
    const LoadTime = setTimeout(function () {
      Loading.className = "fa fa-refresh";
      clearTimeout(LoadTime);
    }, 3000);
  }
}

function ShowSelectForm(ActiveForm) {
  document.getElementById("Main").style.display = "none";
  document.getElementById("MethodWi").style.display = "none";
  document.getElementById("MethodBrowser").style.display = "none";
  document.getElementById("SalesWi").style.display = "none";
  document.getElementById("SalesBrowser").style.display = "none";
  document.getElementById("Tahseel_Wi").style.display = "none";
  document.getElementById("Tahseel_Browser").style.display = "none";
  document.getElementById("Expense_Types__Wi").style.display = "none";
  document.getElementById("Expense_Types__Browser").style.display = "none";
  document.getElementById("Tahseel_Types__Wi").style.display = "none";
  document.getElementById("Tahseel_Types__Browser").style.display = "none";
  document.getElementById("Expenses__Wi").style.display = "none";
  document.getElementById("Expenses__Browser").style.display = "none";
  document.getElementById("Reports").style.display = "none";
  document.getElementById(ActiveForm).style.display = "flex";
  localStorage.setItem("ActiveForm", ActiveForm);
}

// *************************************Main**************
async function ShowReports() {
  let Loading = document.getElementById("reports-icon");
  Loading.className = "fa fa-refresh fa-spin";
  await LoadInvoices();
  await LoadTahseel();
  await LoadExpenses();
  ShowSelectForm("Reports");
  const totalTahseel = DataTahseel.reduce(
    (acc, tahseel) => tahseel.ReqAmount + acc,
    0,
  );
  const totalExpenses = DataExpenses.reduce((acc, exp) => exp.Amount + acc, 0);
  document.getElementById("total-sales-count").textContent =
    InvoicesData.length;
  const totalSalesAmount = InvoicesData.reduce(
    (acc, inv) => inv.AmountTotal + acc,
    0,
  );
  document.getElementById("total-sales-amount").textContent =
    totalSalesAmount + " ريال";
  const totalAmountNet = InvoicesData.reduce(
    (acc, inv) => inv.AmountNet + acc,
    0,
  );
  document.getElementById("total-sales-amount-net").textContent =
    totalAmountNet + " ريال";
  document.getElementById("total-tahseel").textContent = totalTahseel + " ريال";
  document.getElementById("total-expenses").textContent =
    totalExpenses + " ريال";
  document.getElementById("available-amount").textContent =
    totalAmountNet - totalExpenses + " ريال";
  Loading.className = "fas fa-chart-bar";
}

async function ShowMethodBrowser() {
  let Loading = document.getElementById("LoadingMethodBrowser");
  let Loading1 = document.getElementById("creditcard");
  let Loading2 = document.getElementById("BackMethodBrowser");
  Loading.className = "fa fa-refresh fa-spin";
  Loading1.className = "fa fa-refresh fa-spin";
  Loading2.className = "fa fa-refresh fa-spin";
  await LoadMethodToTable();
  ShowSelectForm("MethodBrowser");
  Loading.className = "fa fa-refresh";
  Loading1.className = "fa fa-credit-card";
  Loading2.className = "fa fa-mail-reply";
}

async function ShowTahseelTypesBrowser() {
  let Loading = document.getElementById("LoadingTahseelTypesBrowser");
  let Loading1 = document.getElementById("tahseel-types-icon");
  Loading.className = "fa fa-refresh fa-spin";
  Loading1.className = "fa fa-refresh fa-spin";
  await LoadTahseelTypesToTable();
  ShowSelectForm("Tahseel_Types__Browser");
  Loading.className = "fa fa-refresh";
  Loading1.className = "fa fa-credit-card";
}

async function ShowExpenseTypesBrowser() {
  let Loading = document.getElementById("LoadingExpenseTypesBrowser");
  let Loading1 = document.getElementById("expense-types-icon");
  Loading.className = "fa fa-refresh fa-spin";
  Loading1.className = "fa fa-refresh fa-spin";
  await LoadExpenseTypesToTable();
  ShowSelectForm("Expense_Types__Browser");
  Loading.className = "fa fa-refresh";
  Loading1.className = "fa fa-credit-card";
}

async function ShowExpensesWi() {
  let Loading2 = document.getElementById("LoadingExpensesPlus");
  Loading2.className = "fa fa-refresh fa-spin";
  await LoadExpenseTypes();
  populateSelect(
    document.getElementById("Expenses__Wi__ExpenseTypeNum"),
    DataExpenseTypes,
    {
      label: "Name",
      value: "Num",
    },
  );
  ShowSelectForm("Expenses__Wi");
  Loading2.className = "fa fa-plus";
  updateExpenseTypeName();
}

async function ShowTahseelTypesWi() {
  let Loading = document.getElementById("LoadingTahseelTypesPlus");
  await LoadPaymentMethods();
  ShowSelectForm("Tahseel_Types__Wi");
  Loading.className = "fa fa-plus";
}

async function ShowExpenseTypesWi() {
  let Loading = document.getElementById("LoadingExpenseTypesPlus");
  Loading.className = "fa fa-refresh fa-spin";
  await LoadPaymentMethods();
  ShowSelectForm("Expense_Types__Wi");
  Loading.className = "fa fa-plus";
}

function ShowMethodWi() {
  let Loading = document.getElementById("LoadingMethodplus");
  Loading.className = "fa fa-refresh fa-spin";
  LoadPaymentMethods();
  const myTimeout = setTimeout(function () {
    ShowSelectForm("MethodWi");
    Loading.className = "fa fa-plus";
    clearTimeout(myTimeout);
  }, 1000);
}

async function ShowTahseelWi() {
  const tahseelTypes = await LoadTahseelTypes();
  populateSelect(
    document.getElementById("Tahseel_Wi__TahseelTypeNum"),
    tahseelTypes,
    {
      value: "Num",
      label: "Name",
    },
  );
  await LoadPaymentMethods(false);
  populateSelect(
    document.getElementById("Tahseel_Wi__MethodNum"),
    DataPaymentMethods,
    {
      value: "Num",
      label: "MetodName",
    },
  );
  ShowSelectForm("Tahseel_Wi");
  onTahseelIsPaidChange();
}

async function ShowSalesWi() {
  let Loading = document.getElementById("invoicedollar");
  let Loading1 = document.getElementById("BackMain");
  Loading.className = "fa fa-refresh fa-spin";
  Loading1.className = "fa fa-refresh fa-spin";
  await LoadPaymentMethods();
  LoadSetting();
  await LoadInvoices();
  Loadplaces();
  const myTimeout = setTimeout(function () {
    Loading.className = "fas fa-plus";
    Loading1.className = "fa fa-mail-reply";
    ClearItemSa();
    ShowSelectForm("SalesWi");
    clearTimeout(myTimeout);
  }, 3000);
}

function GoToMain() {
  ShowSelectForm("Main");
}

function showLoading(elm) {
  elm.className = "fa fa-refresh fa-spin";
}

// function IsfoundUser(TPassWord){
//   let error_User_ID= document.getElementById("error_User_ID");
//     for (let index = 0; index < DataUsers.length; index++) {
//       if(TPassWord==DataUsers[index].PassWord){
//         localStorage.setItem("User_Index", index);
//         return true;
//       }
//     }
//       error_User_ID.className="fa fa-warning";
//       return false ;
//   }

//   function foundIndex(TPassWord){
//       for (let index = 0; index < DataUsers.length; index++) {
//         if(TPassWord==DataUsers[index].PassWord){
//           return index
//         }
//       }
//       return -1
//     }

// function Istrue(TPassWord){
//   let error_User_ID= document.getElementById("error_User_ID");
//   if(TPassWord===""){ error_User_ID.className="fa fa-warning"; return false;}else{ error_User_ID.className="" }
//   if(IsfoundUser(TPassWord)===false){return false}else{error_User_ID.className=""}
//   return true;
// }

// function Sign_In(){
//   let User_PassWord= document.getElementById("User_PassWord");
//   if (Istrue(User_PassWord.value)===true){
//     let User_Index = localStorage.getItem("User_Index");
//     localStorage.setItem("User_Name", DataUsers[User_Index].UserName);
//     localStorage.setItem("PassWord",DataUsers[User_Index].PassWord);
//     ShowSelectForm("Main");
//     location.reload();
//   }
// }

// function ShowPassword(){
//   let User_PassWord= document.getElementById("User_PassWord");
//   let Eye_Password= document.getElementById("Eye_Password");
//   if (Eye_Password.className=="fa fa-eye"){
//     User_PassWord.type="text";
//     Eye_Password.className="fa fa-eye-slash";
//   }else{
//     User_PassWord.type="password";
//     Eye_Password.className="fa fa-eye";
//   }
// }

// **************************MethodBrowser***********

async function LoadPaymentMethods(populateSelect = true) {
  DataPaymentMethods = [];
  await fetch(MethodUrl)
    .then((res) => res.text())
    .then((rep) => {
      const jsonMethod = JSON.parse(rep.substring(47).slice(0, -2));
      const colzMethod = [];
      jsonMethod.table.cols.forEach((headingMethod) => {
        if (headingMethod.label) {
          let columnMethod = headingMethod.label;
          colzMethod.push(columnMethod);
        }
      });
      jsonMethod.table.rows.forEach((rowMethod1) => {
        const rowMethod = {};
        colzMethod.forEach((ele, ind) => {
          rowMethod[ele] = rowMethod1.c[ind] != null ? rowMethod1.c[ind].v : "";
        });
        DataPaymentMethods.push(rowMethod);
      });
      if (populateSelect) LoadMethodName();
    });
  return DataPaymentMethods;
}

function LoadMethodName() {
  let MetodNum, MetodName;
  let optionClass;
  let MethodNum = document.getElementById("MethodNum");
  MethodNum.innerHTML = "";
  for (let index = 0; index < DataPaymentMethods.length; index++) {
    MetodNum = DataPaymentMethods[index].MetodNum;
    MetodName = DataPaymentMethods[index].MetodName;
    if (DataPaymentMethods[index].Num != "") {
      optionClass = document.createElement("option");
      optionClass.value = MetodNum;
      optionClass.textContent = MetodName;
      MethodNum.appendChild(optionClass);
    }
  }
}

async function LoadMethodToTable() {
  let Num, MetodNum, MetodName, PercentMetod, AmountMetod;
  let Loading = document.getElementById("LoadingMethodBrowser");
  Loading.className = "fa fa-refresh fa-spin";
  document.getElementById("bodyTableMethod").innerHTML = "";
  await LoadPaymentMethods();
  if (isNaN(DataPaymentMethods[0].Num) == false) {
    for (let index = 0; index < DataPaymentMethods.length; index++) {
      Num = DataPaymentMethods[index].Num;
      MetodNum = DataPaymentMethods[index].MetodNum;
      MetodName = DataPaymentMethods[index].MetodName;
      PercentMetod = DataPaymentMethods[index].PercentMetod;
      AmountMetod = DataPaymentMethods[index].AmountMetod;
      if (DataPaymentMethods[index].Num != "") {
        AddRowMethod(Num, MetodNum, MetodName, PercentMetod, AmountMetod);
      }
    }
  }
  Loading.className = "fa fa-refresh";
}

function AddRowMethod(Num, MetodNum, MetodName, PercentMetod, AmountMetod) {
  let td;
  let bodydata = document.getElementById("bodyTableMethod");
  let row = bodydata.insertRow();
  row.id = "Method" + bodydata.childElementCount;
  let cell = row.insertCell();
  cell.id = "Method" + bodydata.childElementCount + "Num";
  cell.innerHTML = Num;
  cell = row.insertCell();
  cell.id = "Method" + bodydata.childElementCount + "MetodNum";
  cell.innerHTML = MetodNum;
  cell.style.display = "none";
  cell = row.insertCell();
  cell.id = "Method" + bodydata.childElementCount + "MetodName";
  cell.innerHTML = MetodName;
  cell = row.insertCell();
  cell.id = "Method" + bodydata.childElementCount + "PercentMetod";
  cell.innerHTML = PercentMetod;
  cell = row.insertCell();
  cell.id = "Method" + bodydata.childElementCount + "AmountMetod";
  cell.innerHTML = AmountMetod;
  row.appendChild((td = document.createElement("td")));
  btb = document.createElement("button");
  btb.type = "button";
  btb.id = "Lbutton" + bodydata.childElementCount;
  btb.innerHTML = "<a class='fa fa-edit' style='color:rgb(80, 37, 3)'> </a>";
  btb.className = "BtnStyle1";
  btb.onclick = function () {
    EditeMethod();
  };
  td.appendChild(btb);
}

function EditeMethod() {
  let indextable = document.activeElement.parentElement.parentElement.id;
  let Num = document.getElementById(indextable).children.item(0).textContent;
  let MetodNum = document
    .getElementById(indextable)
    .children.item(1).textContent;
  let MetodName = document
    .getElementById(indextable)
    .children.item(2).textContent;
  let PercentMetod = document
    .getElementById(indextable)
    .children.item(3).textContent;
  let AmountMetod = document
    .getElementById(indextable)
    .children.item(4).textContent;
  let Loading = document
    .getElementById(indextable)
    .children.item(5)
    .children.item(0)
    .children.item(0);
  document.getElementById("RowMethod").value = Number(Num) + 1;
  document.getElementById("MetodNum").value = MetodNum;
  document.getElementById("MetodName").value = MetodName;
  document.getElementById("PercentMetod").value = PercentMetod;
  document.getElementById("AmountMetod").value = AmountMetod;
  Loading.className = "fa fa-refresh fa-spin";
  LoadPaymentMethods();
  const myTimeout = setTimeout(function () {
    ShowSelectForm("MethodWi");
    Loading.className = "fa fa-edit";
    clearTimeout(myTimeout);
  }, 1000);
}

// ********************MethodWi

function MaxMethodNumber() {
  let XX;
  let MethodNumber = [];
  for (let index = 0; index < DataPaymentMethods.length; index++) {
    if (DataPaymentMethods[index].MetodName != "") {
      MethodNumber.push(DataPaymentMethods[index].MetodNum);
    }
  }
  XX = Math.max.apply(Math, MethodNumber) + 1;
  if (isNaN(XX) == true) {
    return 1;
  } else {
    return XX;
  }
}

function ClearItemCu() {
  document.getElementById("MetodNum").value = MaxMethodNumber();
  document.getElementById("MetodName").value = "";
  document.getElementById("PercentMetod").value = "";
  document.getElementById("AmountMetod").value = "";
}

function IsFoundMethodName(MethodName) {
  if (MethodName != undefined) {
    for (let index = 0; index < DataPaymentMethods.length; index++) {
      if (MethodName.value == DataPaymentMethods[index].MetodName) {
        MethodName.style.border = "2px solid #ff0000";
        return index;
      }
    }
    MethodName.style.border = "none";
    return -1;
  }
}

function IstrueDataInform() {
  let MetodName = document.getElementById("MetodName");
  let PercentMetod = document.getElementById("PercentMetod");
  let AmountMetod = document.getElementById("AmountMetod");
  if (MetodName.value == "") {
    MetodName.style.border = "2px solid #ff0000";
    return false;
  } else {
    MetodName.style.border = "none";
  }
  if (PercentMetod.value == "") {
    PercentMetod.style.border = "2px solid #ff0000";
    return false;
  } else {
    PercentMetod.style.border = "none";
  }
  if (AmountMetod.value == "") {
    AmountMetod.style.border = "2px solid #ff0000";
    return false;
  } else {
    AmountMetod.style.border = "none";
  }
  return true;
}

function onsubmitForm1() {
  if (IstrueDataInform() === true) {
    let MetodName = document.getElementById("MetodName");
    if (IsFoundMethodName(MetodName) == -1) {
      document.getElementById("MetodNum").value = MaxMethodNumber();
      document.getElementById("ModeP").value = "1";
      onsubmitForm(5000);
    }
  }
}

function IsFoundMethodModify(MetodName, MetodNum) {
  if (MetodName != undefined) {
    for (let index = 0; index < DataPaymentMethods.length; index++) {
      if (
        MetodName.value == DataPaymentMethods[index].MetodName &&
        MetodNum.value != DataPaymentMethods[index].MetodNum
      ) {
        MetodName.style.border = "2px solid #ff0000";
        return index;
      }
    }
    MetodName.style.border = "none";
    return -1;
  }
}

function onsubmitForm2() {
  if (IstrueDataInform() === true) {
    let MetodName = document.getElementById("MetodName");
    let MetodNum = document.getElementById("MetodNum");
    if (IsFoundMethodModify(MetodName, MetodNum) == -1) {
      document.getElementById("ModeP").value = "2";
      onsubmitForm(5000);
    }
  }
}

function onsubmitForm3() {
  if (IsFoundMethodName(document.getElementById("MethodName")) == -1) {
    return;
  }
  document.getElementById("ModeP").value = "3";
  onsubmitForm(4000);
}

function onsubmitForm(Time) {
  document.getElementById("typeP").value = "1";
  let MainForm = document.getElementById("FormMethodDetails");
  var w = window.open("", "form_target", "width=600, height=400");
  MainForm.target = "form_target";
  MainForm.action = Script;
  MainForm.submit();
  if (MainForm.onsubmit() == true) {
    const myTimeout = setTimeout(function () {
      w.close();
      clearTimeout(myTimeout);
      location.reload();
    }, Time);
  }
}

// ******************** Expense ********************
async function ShowExpensesBrowser() {
  let Loading = document.getElementById("expenses-browser-icon");
  Loading.className = "fa fa-refresh fa-spin";
  await LoadExpenseTable();
  Loading.className = "fa fa-refresh";
  Loading.className = "fas fa-file-invoice-dollar";
  ShowSelectForm("Expenses__Browser");
}

async function LoadExpenseTable() {
  let Loading = document.getElementById("LoadingExpensesBrowser");
  Loading.className = "fa fa-refresh fa-spin";
  document.getElementById("bodyTableExpenses").innerHTML = "";
  await LoadExpenses();
  if (isNaN(DataExpenses[0].Num) == false) {
    for (let index = 0; index < DataExpenses.length; index++) {
      if (DataExpenses[index].Num != "") {
        AddExpenseTableRow(
          DataExpenses[index].Num,
          DataExpenses[index].Amount,
          DataExpenses[index].Tax,
          DataExpenses[index].ExpenseTypeName,
          DataExpenses[index].ExpenseTypeNum,
          DataExpenses[index].Recipient,
          DataExpenses[index].Date,
        );
      }
    }
    AddExpenseTotalRow();
  }
  Loading.className = "fa fa-refresh";
}

function AddExpenseTotalRow() {
  let bodydata = document.getElementById("bodyTableExpenses");
  let row = bodydata.insertRow();
  row.id = "S" + bodydata.childElementCount;
  let cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "NumT";
  cell.innerHTML = "المجموع";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "AmountT";
  cell.innerHTML = GetFormat(String(Calculate("Expense__Browser__Amount")));
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "TaxT";
  cell.innerHTML = GetFormat(String(Calculate("Expense__Browser__Tax")));
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "ExpenseTypeT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "RecipientT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "DateT";
  cell.innerHTML = "";
  cell = row.insertCell();
}

async function LoadExpenses() {
  DataExpenses = [];
  await fetch(ExpensesUrl)
    .then((res) => res.text())
    .then((rep) => {
      const jsonData0 = JSON.parse(rep.substring(47).slice(0, -2));
      const colzData0 = [];
      jsonData0.table.cols.forEach((headingData0) => {
        if (headingData0.label) {
          let columnData0 = headingData0.label;
          colzData0.push(columnData0);
        }
      });
      jsonData0.table.rows.forEach((rowData01) => {
        const rowData0 = {};
        colzData0.forEach((ele, ind) => {
          rowData0[ele.trim()] =
            rowData01.c[ind] != null ? rowData01.c[ind].v : "";
        });
        DataExpenses.push(rowData0);
      });
    });
  return DataExpenses;
}

function AddExpenseTableRow(
  Num,
  Amount,
  Tax,
  ExpenseTypeName,
  ExpenseTypeNum,
  Recipient,
  Date,
) {
  let bodydata = document.getElementById("bodyTableExpenses");
  let row = bodydata.insertRow();
  row.id = "S" + bodydata.childElementCount;
  let cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Num";
  cell.innerHTML = Num;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Amount";
  cell.innerHTML = Amount;
  cell.className = "Expense__Browser__Amount";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Tax";
  cell.innerHTML = Tax;
  cell.className = "Expense__Browser__Tax";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "ExpenseTypeName";
  cell.innerHTML = ExpenseTypeName;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "ExpenseTypeNum";
  cell.innerHTML = ExpenseTypeNum;
  cell.style = "display: none";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Recipient";
  cell.innerHTML = Recipient;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Date";
  cell.innerHTML = GetDateFromString(Date);
  row.appendChild((td = document.createElement("td")));
  var btb = document.createElement("button");
  btb.type = "button";
  btb.id = "ButS" + bodydata.childElementCount;
  btb.onclick = async function () {
    await showExpense();
  };
  btb.innerHTML = `<a class='fa fa-edit' style='color:#ff5e00 ; width:100% ;'> </a>`;
  td.appendChild(btb);
  btb.style.cursor = "pointer";
  btb.style.color = "red";
  btb.style.width = "100%";
}

async function showExpense() {
  let indextable = document.activeElement.parentElement.parentElement.id;
  let Num = document.getElementById(indextable).children.item(0).textContent;
  let Amount = document.getElementById(indextable).children.item(1).textContent;
  let Tax = document.getElementById(indextable).children.item(2).textContent;
  let ExpenseTypeName = document
    .getElementById(indextable)
    .children.item(3).textContent;
  let ExpenseTypeNum = document
    .getElementById(indextable)
    .children.item(4).textContent;
  let Recipient = document
    .getElementById(indextable)
    .children.item(5).textContent;
  let Date = document.getElementById(indextable).children.item(6).textContent;
  let Loading = document
    .getElementById(indextable)
    .children.item(7)
    .children.item(0)
    .children.item(0);

  Loading.className = "fa fa-refresh fa-spin";
  await LoadExpenseTypes();
  populateSelect(
    document.getElementById("Expenses__Wi__ExpenseTypeNum"),
    DataExpenseTypes,
    {
      value: "Num",
      label: "Name",
    },
  );
  document.getElementById("Expenses__Wi__Row").value = Number(Num) + 1;
  document.getElementById("Expenses__Wi__Amount").value = Amount;
  document.getElementById("Expenses__Wi__Tax").value = Tax;
  document.getElementById("Expenses__Wi__ExpenseTypeNum").value =
    ExpenseTypeNum;
  document.getElementById("Expenses__Wi__ExpenseTypeName").value =
    ExpenseTypeName;
  document.getElementById("Expenses__Wi__Recipient").value = Recipient;
  document.getElementById("Expenses__Wi__Date").value = Date;
  ShowSelectForm("Expenses__Wi");
  Loading.className = "fa fa-edit";
}

function onExpenseAmountChange() {
  document.getElementById("Expenses__Wi__Tax").value =
    document.getElementById("Expenses__Wi__Amount").value * 0.15;
}

function updateExpenseTypeName() {
  const num = document.getElementById("Expenses__Wi__ExpenseTypeNum").value;
  const name = DataExpenseTypes.find((t) => t.Num === Number(num)).Name;
  document.getElementById("Expenses__Wi__ExpenseTypeName").value = name;
}

function createExpense() {
  document.getElementById("Expenses__Wi__Mode").value = "create";
  submitExpenseForm();
}

function editExpense() {
  if (document.getElementById("Expenses__Wi__Row").value === "") return;
  document.getElementById("Expenses__Wi__Mode").value = "update";
  submitExpenseForm();
}

function deleteExpense() {
  if (document.getElementById("Expenses__Wi__Row").value === "") return;
  document.getElementById("Expenses__Wi__Mode").value = "delete";
  submitExpenseForm();
}

function clearExpense() {
  document.getElementById("Expenses__Wi__Amount").value = "";
  document.getElementById("Expenses__Wi__Recipient").value = "";
  document.getElementById("Expenses__Wi__Date").value = "";
  onExpenseAmountChange();
}

function submitExpenseForm(Time = 5000) {
  document.getElementById("Expenses__Wi__Type").value = "expense";
  let MainForm = document.getElementById("FormExpensesDetails");
  var w = window.open("", "form_target", "width=600, height=400");
  MainForm.target = "form_target";
  MainForm.action = Script;
  MainForm.submit();
  if (MainForm.onsubmit() == true) {
    const myTimeout = setTimeout(function () {
      w.close();
      clearTimeout(myTimeout);
      location.reload();
    }, Time);
  }
}

// ******************** Tahseel Type ***************
function createTahseelType() {
  document.getElementById("Tahseel_Types__Wi__Mode").value = "create";
  submitTahseelTypeForm();
}

function editTahseelType() {
  if (document.getElementById("Tahseel_Types__Wi__Row").value === "") return;
  document.getElementById("Tahseel_Types__Wi__Mode").value = "update";
  submitTahseelTypeForm();
}

function deleteTahseelType() {
  if (document.getElementById("Tahseel_Types__Wi__Row").value === "") return;
  document.getElementById("Tahseel_Types__Wi__Mode").value = "delete";
  submitTahseelTypeForm();
}

function clearTahseelType() {
  document.getElementById("Tahseel_Types__Wi__Name").value = "";
}

function submitTahseelTypeForm(Time = 5000) {
  document.getElementById("Tahseel_Types__Wi__Type").value = "tahseel-type";
  let MainForm = document.getElementById("FormTahseelTypesDetails");
  var w = window.open("", "form_target", "width=600, height=400");
  MainForm.target = "form_target";
  MainForm.action = Script;
  MainForm.submit();
  if (MainForm.onsubmit() == true) {
    const myTimeout = setTimeout(function () {
      w.close();
      clearTimeout(myTimeout);
      location.reload();
    }, Time);
  }
}

async function LoadTahseelTypesToTable() {
  let Num, Name;
  let Loading = document.getElementById("LoadingTahseelTypesBrowser");
  Loading.className = "fa fa-refresh fa-spin";
  document.getElementById("bodyTableTahseelTypes").innerHTML = "";
  await LoadTahseelTypes();
  if (isNaN(DataTahseelTypes[0].Num) == false) {
    for (let index = 0; index < DataTahseelTypes.length; index++) {
      Num = DataTahseelTypes[index].Num;
      Name = DataTahseelTypes[index].Name;
      if (DataTahseelTypes[index].Num != "") {
        AddRowTahseelType(Num, Name);
      }
    }
  }
  Loading.className = "fa fa-refresh";
}

async function LoadTahseelTypes() {
  DataTahseelTypes = [];
  await fetch(TahseelTypesUrl)
    .then((res) => res.text())
    .then((rep) => {
      const jsonData0 = JSON.parse(rep.substring(47).slice(0, -2));
      const colzData0 = [];
      jsonData0.table.cols.forEach((headingData0) => {
        if (headingData0.label) {
          let columnData0 = headingData0.label;
          colzData0.push(columnData0);
        }
      });
      jsonData0.table.rows.forEach((rowData01) => {
        const rowData0 = {};
        colzData0.forEach((ele, ind) => {
          rowData0[ele.trim()] =
            rowData01.c[ind] != null ? rowData01.c[ind].v : "";
        });
        DataTahseelTypes.push(rowData0);
      });
    });
  return DataTahseelTypes;
}

function AddRowTahseelType(Num, Name) {
  let bodydata = document.getElementById("bodyTableTahseelTypes");
  let row = bodydata.insertRow();
  row.id = "S" + bodydata.childElementCount;
  let cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Num";
  cell.innerHTML = Num;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Name";
  cell.innerHTML = Name;
  row.appendChild((td = document.createElement("td")));
  var btb = document.createElement("button");
  btb.type = "button";
  btb.id = "ButS" + bodydata.childElementCount;
  btb.onclick = async function () {
    await showTahseelType();
  };
  btb.innerHTML = `<a class='fa fa-edit' style='color:#ff5e00 ; width:100% ;'> </a>`;
  td.appendChild(btb);
  btb.style.cursor = "pointer";
  btb.style.color = "red";
  btb.style.width = "100%";
}

async function showTahseelType() {
  let indextable = document.activeElement.parentElement.parentElement.id;
  let Num = document.getElementById(indextable).children.item(0).textContent;
  let Name = document.getElementById(indextable).children.item(1).textContent;
  let Loading = document
    .getElementById(indextable)
    .children.item(2)
    .children.item(0)
    .children.item(0);
  Loading.className = "fa fa-refresh fa-spin";
  document.getElementById("Tahseel_Types__Wi__Row").value = Number(Num) + 1;
  document.getElementById("Tahseel_Types__Wi__Name").value = Name;
  ShowSelectForm("Tahseel_Types__Wi");
  Loading.className = "fa fa-edit";
}

// ******************** Expense Type ***************
function createExpenseType() {
  document.getElementById("Expense_Types__Wi__Mode").value = "create";
  submitExpenseTypeForm();
}

function editExpenseType() {
  if (document.getElementById("Expense_Types__Wi__Row").value === "") return;
  document.getElementById("Expense_Types__Wi__Mode").value = "update";
  submitExpenseTypeForm();
}

function deleteExpenseType() {
  if (document.getElementById("Expense_Types__Wi__Row").value === "") return;
  document.getElementById("Expense_Types__Wi__Mode").value = "delete";
  submitExpenseTypeForm();
}

function clearExpenseType() {
  document.getElementById("Expense_Types__Wi__Name").value = "";
}

function submitExpenseTypeForm(Time = 5000) {
  document.getElementById("Expense_Types__Wi__Type").value = "expense-type";
  let MainForm = document.getElementById("FormExpenseTypesDetails");
  var w = window.open("", "form_target", "width=600, height=400");
  MainForm.target = "form_target";
  MainForm.action = Script;
  MainForm.submit();
  if (MainForm.onsubmit() == true) {
    const myTimeout = setTimeout(function () {
      w.close();
      clearTimeout(myTimeout);
      location.reload();
    }, Time);
  }
}

async function LoadExpenseTypesToTable() {
  let Num, Name;
  let Loading = document.getElementById("LoadingExpenseTypesBrowser");
  Loading.className = "fa fa-refresh fa-spin";
  document.getElementById("bodyTableExpenseTypes").innerHTML = "";
  await LoadExpenseTypes();
  if (isNaN(DataExpenseTypes[0].Num) == false) {
    for (let index = 0; index < DataExpenseTypes.length; index++) {
      Num = DataExpenseTypes[index].Num;
      Name = DataExpenseTypes[index].Name;
      if (DataExpenseTypes[index].Num != "") {
        AddRowExpenseType(Num, Name);
      }
    }
  }
  Loading.className = "fa fa-refresh";
}

async function LoadExpenseTypes() {
  DataExpenseTypes = [];
  await fetch(ExpenseTypesUrl)
    .then((res) => res.text())
    .then((rep) => {
      const jsonData0 = JSON.parse(rep.substring(47).slice(0, -2));
      const colzData0 = [];
      jsonData0.table.cols.forEach((headingData0) => {
        if (headingData0.label) {
          let columnData0 = headingData0.label;
          colzData0.push(columnData0);
        }
      });
      jsonData0.table.rows.forEach((rowData01) => {
        const rowData0 = {};
        colzData0.forEach((ele, ind) => {
          rowData0[ele.trim()] =
            rowData01.c[ind] != null ? rowData01.c[ind].v : "";
        });
        DataExpenseTypes.push(rowData0);
      });
    });
  return DataExpenseTypes;
}

function AddRowExpenseType(Num, Name) {
  let bodydata = document.getElementById("bodyTableExpenseTypes");
  let row = bodydata.insertRow();
  row.id = "S" + bodydata.childElementCount;
  let cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Num";
  cell.innerHTML = Num;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Name";
  cell.innerHTML = Name;
  row.appendChild((td = document.createElement("td")));
  var btb = document.createElement("button");
  btb.type = "button";
  btb.id = "ButS" + bodydata.childElementCount;
  btb.onclick = async function () {
    await showExpenseType();
  };
  btb.innerHTML = `<a class='fa fa-edit' style='color:#ff5e00 ; width:100% ;'> </a>`;
  td.appendChild(btb);
  btb.style.cursor = "pointer";
  btb.style.color = "red";
  btb.style.width = "100%";
}

async function showExpenseType() {
  let indextable = document.activeElement.parentElement.parentElement.id;
  let Num = document.getElementById(indextable).children.item(0).textContent;
  let Name = document.getElementById(indextable).children.item(1).textContent;
  let Loading = document
    .getElementById(indextable)
    .children.item(2)
    .children.item(0)
    .children.item(0);
  Loading.className = "fa fa-refresh fa-spin";
  document.getElementById("Expense_Types__Wi__Row").value = Number(Num) + 1;
  document.getElementById("Expense_Types__Wi__Name").value = Name;
  ShowSelectForm("Expense_Types__Wi");
  Loading.className = "fa fa-edit";
}

// ******************** Tahseel ********************
async function LoadTahseelTable() {
  let Loading = document.getElementById("LoadingTahseelBrowser");
  Loading.className = "fa fa-refresh fa-spin";
  document.getElementById("bodyTableTahseel").innerHTML = "";
  await LoadTahseel();
  if (isNaN(DataTahseel[0].Num) == false) {
    for (let index = 0; index < DataTahseel.length; index++) {
      if (DataTahseel[index].Num != "") {
        AddTahseelTableRow(
          DataTahseel[index].Num,
          DataTahseel[index].BillNumber,
          DataTahseel[index].BillAmount,
          DataTahseel[index].PaymentMethodName,
          DataTahseel[index].PaymentMethodNum,
          DataTahseel[index].ReqAmount,
          DataTahseel[index].Date,
          DataTahseel[index].TahseelTypeNum,
          DataTahseel[index].TahseelTypeName,
          DataTahseel[index].IsPaid === true,
        );
      }
    }
    AddTahseelTotalRow();
  }
  Loading.className = "fa fa-refresh";
}

async function LoadTahseel() {
  DataTahseel = [];
  await fetch(TahseelUrl)
    .then((res) => res.text())
    .then((rep) => {
      const jsonData0 = JSON.parse(rep.substring(47).slice(0, -2));
      const colzData0 = [];
      jsonData0.table.cols.forEach((headingData0) => {
        if (headingData0.label) {
          let columnData0 = headingData0.label;
          colzData0.push(columnData0);
        }
      });
      jsonData0.table.rows.forEach((rowData01) => {
        const rowData0 = {};
        colzData0.forEach((ele, ind) => {
          rowData0[ele.trim()] =
            rowData01.c[ind] != null ? rowData01.c[ind].v : "";
        });
        DataTahseel.push(rowData0);
      });
    });
  return DataTahseel;
}
async function ShowTahseelBrowser() {
  let Loading = document.getElementById("tahseel-browser-loading");
  Loading.className = "fa fa-refresh fa-spin";
  await LoadTahseelTable();
  Loading.className = "fa fa-refresh";
  Loading.className = "fas fa-file-invoice-dollar";
  ShowSelectForm("Tahseel_Browser");
}

function AddTahseelTableRow(
  Num,
  BillNumber,
  BillAmount,
  PaymentMethodName,
  PaymentMethodNum,
  ReqAmount,
  Date,
  TahseelTypeNum,
  TahseelTypeName,
  IsPaid,
) {
  let bodydata = document.getElementById("bodyTableTahseel");
  let row = bodydata.insertRow();
  row.id = "S" + bodydata.childElementCount;
  let cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Num";
  cell.innerHTML = Num;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "BillNumber";
  cell.innerHTML = BillNumber;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "BillAmount";
  cell.innerHTML = BillAmount;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "PaymentMethodNum";
  cell.innerHTML = PaymentMethodNum;
  cell.style = "display: none;";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "PaymentMethodName";
  cell.innerHTML = PaymentMethodName;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "TrueReqAmount";
  cell.innerHTML = GetFormat(String(ReqAmount));
  cell.style = "display: none;";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "ReqAmount";
  cell.innerHTML = GetFormat(String(IsPaid ? 0 : -1 * ReqAmount));
  cell.className = "Tahseel_Browser__ReqAmount";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Paid";
  cell.innerHTML = GetFormat(String(IsPaid ? ReqAmount : 0));
  cell.className = "Tahseel_Browser__Paid";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Date";
  cell.innerHTML = GetDateFromString(Date);
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "TahseelTypeNum";
  cell.innerHTML = TahseelTypeNum;
  cell.style = "display: none";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "TahseelTypeName";
  cell.innerHTML = TahseelTypeName;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "IsPaidActual";
  cell.style = "display: none";
  cell.innerHTML = IsPaid ? "0" : "1";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "IsPaid";
  cell.innerHTML = `<input type="checkbox" onchange="updateIsPaid(${Num}, this.checked)" ${
    IsPaid ? 'checked=""' : ""
  }>`;
  row.appendChild((td = document.createElement("td")));
  var btb = document.createElement("button");
  btb.type = "button";
  btb.id = "ButS" + bodydata.childElementCount;
  btb.onclick = async function () {
    await showTahseel();
  };
  btb.innerHTML = `<a class='fa fa-edit' style='color:#ff5e00 ; width:100% ;'> </a>`;
  td.appendChild(btb);
  btb.style.cursor = "pointer";
  btb.style.color = "red";
  btb.style.width = "100%";
}

function AddTahseelTotalRow() {
  let bodydata = document.getElementById("bodyTableTahseel");
  let row = bodydata.insertRow();
  row.id = "S" + bodydata.childElementCount;
  let cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "NumT";
  cell.innerHTML = "المجموع";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "BillNumberT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "BillAmountT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "PaymentMethodT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "ReqAmountT";
  cell.innerHTML = GetFormat(String(Calculate("Tahseel_Browser__ReqAmount")));
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "PaidT";
  cell.innerHTML = GetFormat(String(Calculate("Tahseel_Browser__Paid")));
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "IsPaidT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "DateT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "TahseelTypeT";
  cell.innerHTML = "";
  cell = row.insertCell();
}

function updateIsPaid(Num, IsPaid) {
  const Row = Num + 1;
  const data = new URLSearchParams();
  data.append("Type", "tahseel");
  data.append("Mode", "update");
  data.append("Row", Row);
  data.append("IsPaid", IsPaid);
  fetch(Script, {
    method: "POST",
    body: data,
  }).then(async () => {
    await ShowTahseelBrowser();
    Toastify({
      text: "تم تحديث التحصيل",
      gravity: "bottom",
    }).showToast();
  });
}

async function showTahseel() {
  let indextable = document.activeElement.parentElement.parentElement.id;
  let Num = document.getElementById(indextable).children.item(0).textContent;
  let BillNumber = document
    .getElementById(indextable)
    .children.item(1).textContent;
  let BillAmount = document
    .getElementById(indextable)
    .children.item(2).textContent;
  let PaymentMethodNum = document
    .getElementById(indextable)
    .children.item(3).textContent;
  let ReqAmount = document
    .getElementById(indextable)
    .children.item(5).textContent;
  let Date = document.getElementById(indextable).children.item(8).textContent;
  let TahseelTypeNum = document
    .getElementById(indextable)
    .children.item(9).textContent;
  let IsPaid =
    document.getElementById(indextable).children.item(11).textContent === "0";
  let Loading = document
    .getElementById(indextable)
    .children.item(13)
    .children.item(0)
    .children.item(0);
  Loading.className = "fa fa-refresh fa-spin";
  await LoadPaymentMethods();
  await LoadTahseelTypes();
  populateSelect(
    document.getElementById("Tahseel_Wi__TahseelTypeNum"),
    DataTahseelTypes,
    {
      value: "Num",
      label: "Name",
    },
  );
  populateSelect(
    document.getElementById("Tahseel_Wi__MethodNum"),
    DataPaymentMethods,
    {
      value: "Num",
      label: "MetodName",
    },
  );
  console.log(document.getElementById(indextable).children.item(13));
  document.getElementById("tahseel-row").value = Number(Num) + 1;
  document.getElementById("Tahseel_Wi__InvoiceBillNumber").value = BillNumber;
  document.getElementById("Tahseel_Wi__InvoiceAmount").value = BillAmount;
  document.getElementById("Tahseel_Wi__MethodNum").value = PaymentMethodNum;
  document.getElementById("Tahseel_Wi__ReqAmount").value = ReqAmount;
  document.getElementById("Tahseel_Wi__Date").value = Date;
  document.getElementById("Tahseel_Wi__TahseelTypeNum").value = TahseelTypeNum;
  document.getElementById("Tahseel_Wi__IsPaid").checked = !!IsPaid;
  ShowSelectForm("Tahseel_Wi");
  onTahseelIsPaidChange();
  Loading.className = "fa fa-edit";
}

function onTahseelIsPaidChange() {
  const newValue = document.getElementById("Tahseel_Wi__IsPaid").checked;
  document.getElementById("Tahseel_Wi__IsPaidActual").value = newValue;
}

function onTahseelInvoiceNumChange() {
  const newValue = document.getElementById(
    "Tahseel_Wi__InvoiceBillNumber",
  ).value;
  const num = newValue;
  const invoice = InvoicesData.find((invoice) => invoice.BillNumber === num);
  const amount = invoice.AmountTotal - invoice.RefundAmount;
  document.getElementById("Tahseel_Wi__InvoiceAmount").value = amount;
  document.getElementById("Tahseel_Wi__InvoiceNum").value = invoice.Num;
  const paymentMethod = DataPaymentMethods.find(
    (p) => p.Num === invoice.MethodNum,
  );
  document.getElementById("Tahseel_Wi__MethodNum").value = invoice.MethodNum;
  document.getElementById("Tahseel_Wi__ReqAmount").value =
    calculatePaymentMethodFee(amount, paymentMethod);
}

function createNewTahseel() {
  document.getElementById("tahseel-mode").value = "create";
  submitTahseelForm();
}

function editTahseel() {
  if (document.getElementById("tahseel-row").value === "") return;
  document.getElementById("tahseel-mode").value = "update";
  submitTahseelForm();
}

function deleteTahseel() {
  if (document.getElementById("tahseel-row").value === "") return;
  document.getElementById("tahseel-mode").value = "delete";
  submitTahseelForm();
}

function submitTahseelForm(Time = 5000) {
  const isPaidElm = document.getElementById("Tahseel_Wi__IsPaid");
  isPaidElm.value = isPaidElm.value ? "true" : "false";
  document.getElementById("tahseel-type").value = "tahseel";
  let MainForm = document.getElementById("FormTahseelDetails");
  var w = window.open("", "form_target", "width=600, height=400");
  MainForm.target = "form_target";
  MainForm.action = Script;
  MainForm.submit();
  if (MainForm.onsubmit() == true) {
    const myTimeout = setTimeout(function () {
      w.close();
      clearTimeout(myTimeout);
      location.reload();
    }, Time);
  }
}

// ********************SalesWi
function LoadSetting() {
  DataSetting = [];
  fetch(SettingUrl)
    .then((res) => res.text())
    .then((rep) => {
      const jsonSetting = JSON.parse(rep.substring(47).slice(0, -2));
      const colzSetting = [];
      jsonSetting.table.cols.forEach((headingSetting) => {
        if (headingSetting.label) {
          let columnSetting = headingSetting.label;
          colzSetting.push(columnSetting);
        }
      });
      jsonSetting.table.rows.forEach((rowData1) => {
        const rowSetting = {};
        colzSetting.forEach((ele, ind) => {
          rowSetting[ele] = rowData1.c[ind] != null ? rowData1.c[ind].v : "";
        });
        DataSetting.push(rowSetting);
      });
      LoadSettingName();
    });
}

function LoadSettingName() {
  let SettingNum, SettingNote, SettingName;
  let optionClass;
  let Ready = document.getElementById("Ready");
  Ready.value = DataSetting[0].SettingName;
  let Tax = document.getElementById("TaxP");
  Tax.value = DataSetting[1].SettingName;
  let ShipNum = document.getElementById("ShipNum");
  ShipNum.innerHTML = "";
  let OtherCost = document.getElementById("OtherCost");
  OtherCost.value = DataSetting[4].SettingName;
  for (let index = 2; index < 4; index++) {
    SettingNum = DataSetting[index].SettingNum;
    SettingNote = DataSetting[index].SettingNote;
    SettingName = DataSetting[index].SettingName;
    optionClass = document.createElement("option");
    optionClass.value = SettingNum;
    optionClass.textContent = SettingNote;
    ShipNum.appendChild(optionClass);
  }
}

function OncahangeShip(Myvalue) {
  let ShipAmount = document.getElementById("ShipAmount");
  ShipAmount.value = DataSetting[Myvalue - 1].SettingName;
  checkbox1.checked = true;
  CaluclateTotalS();
}

function OncahangeMethod(Myvalue) {
  let AmountMetod, PercentMetod, MetodNum;
  let MethodPer = document.getElementById("MethodPer");
  let MethodVa = document.getElementById("MethodVa");
  for (let index = 0; index < DataPaymentMethods.length; index++) {
    MetodNum = DataPaymentMethods[index].MetodNum;
    PercentMetod = DataPaymentMethods[index].PercentMetod;
    AmountMetod = DataPaymentMethods[index].AmountMetod;
    if (MetodNum == Myvalue) {
      MethodPer.value = PercentMetod;
      MethodVa.value = AmountMetod;
    }
  }
  CaluclateTotalS();
}

function Loadplaces() {
  Dataplaces = [];
  fetch(PlacesUrl)
    .then((res) => res.text())
    .then((rep) => {
      const jsonplaces = JSON.parse(rep.substring(47).slice(0, -2));
      const colzplaces = [];
      jsonplaces.table.cols.forEach((headingplaces) => {
        if (headingplaces.label) {
          let columnplaces = headingplaces.label;
          colzplaces.push(columnplaces);
        }
      });
      jsonplaces.table.rows.forEach((rowplaces) => {
        const rowplaces1 = {};
        colzplaces.forEach((ele, ind) => {
          rowplaces1[ele] = rowplaces.c[ind] != null ? rowplaces.c[ind].v : "";
        });
        Dataplaces.push(rowplaces1);
      });
      LoadplacesName();
    });
}

function LoadplacesName() {
  let PlacePrice, PlaceName;
  let optionClass;
  let PlaceName1 = document.getElementById("PlaceName");
  PlaceName1.innerHTML = "";
  for (let index = 0; index < Dataplaces.length; index++) {
    PlacePrice = Dataplaces[index].PlacePrice;
    PlaceName = Dataplaces[index].PlaceName;
    if (Dataplaces[index].Num != "") {
      optionClass = document.createElement("option");
      optionClass.value = PlaceName;
      optionClass.textContent = PlaceName;
      PlaceName1.appendChild(optionClass);
    }
  }
}

function OncahangePlaceName(MyPlace) {
  let PlacePrice1 = document.getElementById("PlacePrice");
  let PlacePrice, PlaceName;
  for (let index = 0; index < Dataplaces.length; index++) {
    PlacePrice = Dataplaces[index].PlacePrice;
    PlaceName = Dataplaces[index].PlaceName;
    if (PlaceName == MyPlace) {
      PlacePrice1.value = PlacePrice;
      CaluclateTotalS();
      return;
    }
  }
  PlacePrice1.value = 0;
  CaluclateTotalS();
}

function ClearItemSa() {
  let BillNumber = document.getElementById("BillNumber");
  document.getElementById("BillNumber2").value = "";
  BillNumber.value = "";
  BillNumber.style.border = "none";
  let Ti = new Date().getTime().valueOf();
  let Ti1 = new Date().getTimezoneOffset().valueOf();
  let Ti2 = Ti1 * 60 * 1000 * -1 + Ti;
  document.getElementById("BillDate").valueAsDate = new Date(Ti2);
  let AmountTotal = document.getElementById("AmountTotal");
  AmountTotal.value = "";
  AmountTotal.style.border = "none";
  let MethodNum = document.getElementById("MethodNum");
  MethodNum.value = "";
  MethodNum.style.border = "none";
  document.getElementById("MethodAmount").value = "";
  document.getElementById("Tax").value = "";
  document.getElementById("ShipNum").value = "";
  document.getElementById("ShipAmount").value = "";
  document.getElementById("AmountNet").value = "";
  document.getElementById("MethodPer").value = "";
  document.getElementById("MethodVa").value = "";
  document.getElementById("PlacePrice").value = "";
  document.getElementById("PlaceName").value = "";
  let Tax = document.getElementById("TaxP");
  Tax.value = DataSetting[1].SettingName;
  let OtherCost = document.getElementById("OtherCost");
  OtherCost.value = DataSetting[4].SettingName;
  let Ready = document.getElementById("Ready");
  Ready.value == DataSetting[0].SettingName;
  document.getElementById("DesCountAmount").value = "";
  document.getElementById("checkbox1").checked = false;
  onchangecheckbox();
}

function CaluclateTotalS() {
  let Value1 = 0;
  let DiCount = 0;
  let PlacePrice = document.getElementById("PlacePrice");
  let AmountTotal = document.getElementById("AmountTotal");
  let RefundAmount = document.getElementById("RefundAmount");
  let AmountActualTotal = document.getElementById("AmountActualTotal");
  let DesCountAmount = document.getElementById("DesCountAmount");
  let DesCountSel = document.getElementById("DesCountSel");
  let Ready = document.getElementById("Ready");
  let MethodPer = document.getElementById("MethodPer");
  let MethodVa = document.getElementById("MethodVa");
  let MethodAmount = document.getElementById("MethodAmount");
  let Tax = document.getElementById("Tax");
  let TaxP = document.getElementById("TaxP");
  let ShipAmount = document.getElementById("ShipAmount");
  let ShipAmount2 = 0;
  if (ShipAmount.value != 0) {
    ShipAmount2 = Number(ShipAmount.value);
  }
  let OtherCost = document.getElementById("OtherCost");
  let AmountNet = document.getElementById("AmountNet");
  AmountActualTotal.value =
    Number(AmountTotal.value) - Number(RefundAmount.value);
  if (DesCountSel.value == "ريال") {
    DiCount = Number(DesCountAmount.value);
  }
  if (DesCountSel.value == "%") {
    DiCount =
      (Number(DesCountAmount.value) * Number(AmountActualTotal.value)) / 100;
  }
  Value1 =
    (Number(AmountActualTotal.value) * Number(MethodPer.value)) / 100 +
    Number(MethodVa.value);
  MethodAmount.value =
    (Number(Value1) * Number(TaxP.value)) / 100 + Number(Value1);
  Tax.value = (Number(TaxP.value) / 100) * Number(AmountActualTotal.value);
  AmountNet.value =
    Number(AmountActualTotal.value) -
    Number(Ready.value) -
    DiCount -
    Number(MethodAmount.value) -
    Number(Tax.value) -
    ShipAmount2 -
    Number(OtherCost.value) -
    Number(PlacePrice.value);
  AmountNet.value = GetFormat(String(AmountNet.value));
}

function onchangecheckbox() {
  let ShipNum = document.getElementById("ShipNum");
  let ShipAmount = document.getElementById("ShipAmount");
  let checkbox1 = document.getElementById("checkbox1");
  if (checkbox1.checked == false) {
    ShipNum.value = "";
    ShipAmount.value = 0;
    ShipNum.disabled = true;
    ShipAmount.style.backgroundColor = "darkgray";
    ShipAmount.disabled = true;
  } else {
    ShipNum.disabled = false;
    ShipAmount.style.backgroundColor = "";
    ShipAmount.disabled = false;
  }
  CaluclateTotalS();
}

function IstrueDataInformS() {
  let BillNumber = document.getElementById("BillNumber");
  let AmountTotal = document.getElementById("AmountTotal");
  let MethodNum = document.getElementById("MethodNum");
  const PlaceName = document.getElementById("PlaceName");
  if (BillNumber.value == "") {
    BillNumber.style.border = "2px solid #ff0000";
    return false;
  } else {
    BillNumber.style.border = "none";
  }
  if (AmountTotal.value == "") {
    AmountTotal.style.border = "2px solid #ff0000";
    return false;
  } else {
    AmountTotal.style.border = "none";
  }
  if (MethodNum.value == "") {
    MethodNum.style.border = "2px solid #ff0000";
    return false;
  } else {
    MethodNum.style.border = "none";
  }
  if (PlaceName.value == "") {
    PlaceName.style.border = "2px solid #ff0000";
    return false;
  } else {
    PlaceName.style.border = "none";
  }
  return true;
}

function onsubmitFormS1() {
  let BillNumber = document.getElementById("BillNumber");
  if (IstrueDataInformS() === true) {
    if (IsNumberFound(BillNumber.value) != -1) {
      BillNumber.style.border = "2px solid #ff0000";
      return;
    } else {
      BillNumber.style.border = "none";
    }
    document.getElementById("ModeS").value = "1";
    onsubmitFormS(6000);
    ShowSalesWi();
  }
}

function IsNumberFound(MyNum) {
  if (isNaN(InvoicesData[0].Num) == true) {
    return -1;
  }
  for (let index = 0; index < InvoicesData.length; index++) {
    if (InvoicesData[index].BillNumber == MyNum) {
      return index;
    }
  }
  return -1;
}

function onsubmitFormS2() {
  let BillNumber = document.getElementById("BillNumber");
  let BillNumber2 = document.getElementById("BillNumber2");
  if (IstrueDataInformS() === true) {
    let Indx = document.getElementById("RowS");
    if (Indx.value != "") {
      if (BillNumber.value != BillNumber2.value) {
        if (IsNumberFound(BillNumber.value) != -1) {
          BillNumber.style.border = "2px solid #ff0000";
          return;
        } else {
          BillNumber.style.border = "none";
        }
      }
      document.getElementById("ModeS").value = "2";
      onsubmitFormS(6000);
    }
  }
}

function onsubmitFormS3() {
  let Indx = document.getElementById("RowS").value;
  if (Indx != "") {
    document.getElementById("ModeS").value = "3";
    onsubmitFormS(5000);
    ShowSalesWi();
  }
}

function onsubmitFormS(Time) {
  let MainForm = document.getElementById("FormSalesWiDetails");
  // const fd = new FormData(MainForm);
  // return console.log(Object.fromEntries(fd));
  document.getElementById("typeS").value = "2";
  var w = window.open("", "form_target", "width=600, height=400");
  MainForm.target = "form_target";
  MainForm.action = Script;
  MainForm.submit();
  if (MainForm.onsubmit() == true) {
    const myTimeout = setTimeout(function () {
      w.close();
      clearTimeout(myTimeout);
    }, Time);
  }
}

// **************************SalesBrowser***********

async function LoadInvoices() {
  InvoicesData = [];
  await fetch(InvoicesUrl)
    .then((res) => res.text())
    .then((rep) => {
      const jsonData0 = JSON.parse(rep.substring(47).slice(0, -2));
      const colzData0 = [];
      jsonData0.table.cols.forEach((headingData0) => {
        if (headingData0.label) {
          let columnData0 = headingData0.label;
          colzData0.push(columnData0);
        }
      });
      jsonData0.table.rows.forEach((rowData01) => {
        const rowData0 = {};
        colzData0.forEach((ele, ind) => {
          rowData0[ele] = rowData01.c[ind] != null ? rowData01.c[ind].v : "";
        });
        InvoicesData.push(rowData0);
      });
    });
  return InvoicesData;
}

function ClearValueNu() {
  document.getElementById("SeaNumber").value = "";
}

function ClearValueDa() {
  document.getElementById("SeaDate").value = "";
}

function GetDateFromString(Str) {
  let MM, DD;
  let ZZ = [];
  let SS = String(Str).substring(5, String(Str).length - 1);
  ZZ = SS.split(",");
  if (Number(ZZ[1]) < 9 && Number(ZZ[1]).length != 2) {
    MM = 0 + String(parseInt(ZZ[1]) + 1);
  } else {
    MM = parseInt(ZZ[1]) + 1;
  }
  if (Number(ZZ[2]) <= 9 && Number(ZZ[1]).length != 2) {
    DD = 0 + ZZ[2];
  } else {
    DD = ZZ[2];
  }
  return ZZ[0] + "-" + MM + "-" + DD;
}

async function ShowSalesBrowser() {
  let Loading = document.getElementById("LoadingSalesBrowser");
  let Loading1 = document.getElementById("invoicedollar2");
  Loading.className = "fa fa-refresh fa-spin";
  Loading1.className = "fa fa-refresh fa-spin";
  document.getElementById("bodydataS").innerHTML = "";
  await LoadInvoices();
  if (isNaN(InvoicesData[0].Num) == false) {
    for (let index = 0; index < InvoicesData.length; index++) {
      if (InvoicesData[index].Num != "") {
        AddRowPrS(
          InvoicesData[index].Num,
          InvoicesData[index].BillNumber,
          InvoicesData[index].BillDate,
          InvoicesData[index].AmountTotal,
          InvoicesData[index].RefundAmount,
          InvoicesData[index].MethodName,
          InvoicesData[index].MethodAmount,
          InvoicesData[index].Tax,
          InvoicesData[index].ShipType,
          InvoicesData[index].ShipAmount,
          InvoicesData[index].OtherCost,
          InvoicesData[index].AmountNet,
          InvoicesData[index].MethodNum,
          InvoicesData[index].ShipNum,
          InvoicesData[index].DesCountAmount,
          InvoicesData[index].Ready,
          InvoicesData[index].DesCountSel,
          InvoicesData[index].PlaceName,
          InvoicesData[index].PlacePrice,
        );
      }
    }
    AddRowTotal();
  }
  Loading.className = "fa fa-refresh";
  Loading1.className = "fas fa-file-invoice-dollar";
  ShowSelectForm("SalesBrowser");
}

function GetFormat(StrText) {
  let Index = StrText.indexOf(".");
  if (Index == -1) {
    return StrText;
  } else {
    return StrText.slice(0, Index + 3);
  }
}

function Calculate(Text) {
  let Calcu = 0;
  let CmatsCL = document.getElementsByClassName(Text);
  for (let index = 0; index < CmatsCL.length; index++) {
    Calcu = Number(CmatsCL[index].textContent) + Calcu;
  }
  return Calcu;
}

function AddRowTotal() {
  let bodydata = document.getElementById("bodydataS");
  let row = bodydata.insertRow();
  row.id = "S" + bodydata.childElementCount;
  let cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "NumT";
  cell.innerHTML = "المجموع";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "BillNumberT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "BillDateT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "AmountTotalT";
  cell.innerHTML = GetFormat(String(Calculate("Calcu1")));
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "RefundAmountTotalT";
  cell.innerHTML = GetFormat(String(Calculate("TotalRefundAmount")));
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "MethodNameT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "MethodAmountT";
  cell.innerHTML = GetFormat(String(Calculate("Calcu2")));
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "TaxT";
  cell.innerHTML = GetFormat(String(Calculate("Calcu3")));
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "ShipTypeT";
  cell.innerHTML = "";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "ShipAmountT";
  cell.innerHTML = GetFormat(String(Calculate("Calcu4")));
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "OtherCostT";
  cell.innerHTML = GetFormat(String(Calculate("Calcu5")));
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "AmountNetT";
  cell.innerHTML = GetFormat(String(Calculate("Calcu6")));
  cell = row.insertCell();
}

function AddRowPrS(
  Num,
  BillNumber,
  BillDate,
  AmountTotal,
  RefundAmount,
  MethodName,
  MethodAmount,
  Tax,
  ShipType,
  ShipAmount,
  OtherCost,
  AmountNet,
  MethodNum,
  ShipNum,
  DesCountAmount,
  Ready,
  DesCountSel,
  PlaceName,
  PlacePrice,
) {
  let bodydata = document.getElementById("bodydataS");
  let row = bodydata.insertRow();
  row.id = "S" + bodydata.childElementCount;
  let cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Num";
  cell.innerHTML = Num;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "BillNumber";
  cell.innerHTML = BillNumber;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "BillDate";
  cell.innerHTML = GetDateFromString(BillDate);
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "AmountTotal";
  cell.innerHTML = GetFormat(String(AmountTotal));
  cell.className = "Calcu1";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "RefundAmount";
  cell.innerHTML = GetFormat(String(RefundAmount));
  cell.className = "TotalRefundAmount";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "MethodName";
  cell.innerHTML = MethodName;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "MethodAmount";
  cell.innerHTML = GetFormat(String(MethodAmount));
  cell.className = "Calcu2";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Tax";
  cell.innerHTML = GetFormat(String(Tax));
  cell.className = "Calcu3";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "ShipType";
  cell.innerHTML = PlaceName;
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "ShipAmount";
  cell.innerHTML = GetFormat(String(PlacePrice));
  cell.className = "Calcu4";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "OtherCost";
  cell.innerHTML = GetFormat(String(OtherCost));
  cell.className = "Calcu5";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "AmountNet";
  cell.innerHTML = GetFormat(String(AmountNet));
  cell.className = "Calcu6";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "MethodNum";
  cell.innerHTML = MethodNum;
  cell.style.display = "none";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "ShipNum";
  cell.innerHTML = ShipNum;
  cell.style.display = "none";
  row.appendChild((td = document.createElement("td")));
  var btb = document.createElement("button");
  btb.type = "button";
  btb.id = "ButS" + bodydata.childElementCount;
  btb.onclick = function () {
    showdatarowsS();
  };
  btb.innerHTML = `<a class='fa fa-edit' style='color:#ff5e00 ; width:100% ;'> </a>`;
  td.appendChild(btb);
  btb.style.cursor = "pointer";
  btb.style.color = "red";
  btb.style.width = "100%";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "DesCountAmount";
  cell.innerHTML = DesCountAmount;
  cell.style.display = "none";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "Ready";
  cell.innerHTML = Ready;
  cell.style.display = "none";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "DesCountSel";
  cell.innerHTML = DesCountSel;
  cell.style.display = "none";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "PlaceName";
  cell.innerHTML = PlaceName;
  cell.style.display = "none";
  cell = row.insertCell();
  cell.id = "S" + bodydata.childElementCount + "PlacePrice";
  cell.innerHTML = PlacePrice;
  cell.style.display = "none";
}

function showdatarowsS() {
  let indextable = document.activeElement.parentElement.parentElement.id;
  let Num = document.getElementById(indextable).children.item(0).textContent;
  let BillNumber = document
    .getElementById(indextable)
    .children.item(1).textContent;
  let BillDate = document
    .getElementById(indextable)
    .children.item(2).textContent;
  let AmountTotal = document
    .getElementById(indextable)
    .children.item(3).textContent;
  let RefundAmount = document
    .getElementById(indextable)
    .children.item(4).textContent;
  // let MethodName=document.getElementById(indextable).children.item(5).textContent  ;
  let MethodAmount = document
    .getElementById(indextable)
    .children.item(6).textContent;
  let Tax = document.getElementById(indextable).children.item(7).textContent;
  // let ShipType=document.getElementById(indextable).children.item(8).textContent  ;
  let ShipAmount = document
    .getElementById(indextable)
    .children.item(9).textContent;
  let OtherCost = document
    .getElementById(indextable)
    .children.item(10).textContent;
  let AmountNet = document
    .getElementById(indextable)
    .children.item(11).textContent;
  let MethodNum = document
    .getElementById(indextable)
    .children.item(12).textContent;
  let ShipNum = document
    .getElementById(indextable)
    .children.item(13).textContent;
  let Loading = document
    .getElementById(indextable)
    .children.item(14)
    .children.item(0)
    .children.item(0);
  let DesCountAmount = document
    .getElementById(indextable)
    .children.item(15).textContent;
  let Ready = document.getElementById(indextable).children.item(16).textContent;
  let DesCountSel = document
    .getElementById(indextable)
    .children.item(17).textContent;
  let PlaceName = document
    .getElementById(indextable)
    .children.item(18).textContent;
  let PlacePrice = document
    .getElementById(indextable)
    .children.item(19).textContent;
  LoadPaymentMethods();
  LoadSetting();
  Loading.className = "fa fa-refresh fa-spin";
  const myTimeout = setTimeout(function () {
    document.getElementById("RowS").value = Number(Num) + 1;
    document.getElementById("BillNumber").value = BillNumber;
    document.getElementById("BillNumber2").value = BillNumber;
    document.getElementById("BillDate").value = BillDate;
    document.getElementById("AmountTotal").value = AmountTotal;
    document.getElementById("RefundAmount").value = RefundAmount;
    document.getElementById("MethodNum").value = MethodNum;
    document.getElementById("MethodAmount").value = MethodAmount;
    document.getElementById("Tax").value = Tax;
    document.getElementById("ShipNum").value = ShipNum;
    let Ship = document.getElementById("ShipAmount");
    Ship.value = ShipAmount;
    document.getElementById("OtherCost").value = OtherCost;
    document.getElementById("AmountNet").value = AmountNet;
    document.getElementById("Ready").value = Ready;
    document.getElementById("DesCountAmount").value = DesCountAmount;
    document.getElementById("DesCountSel").value = DesCountSel;
    if (Ship.value != 0) {
      document.getElementById("checkbox1").checked = true;
      onchangecheckbox();
    }
    document.getElementById("PlaceName").value = PlaceName;
    document.getElementById("PlacePrice").value = PlacePrice;
    OncahangeMethod(MethodNum);
    ShowSelectForm("SalesWi");
    Loading.className = "fa fa-edit";
    clearTimeout(myTimeout);
  }, 2000);
}

async function FillterSalesToTable() {
  let SeaNumber = document.getElementById("SeaNumber");
  let SeaDate = document.getElementById("SeaDate");
  let Loading = document.getElementById("LoadingSalesBrowser");
  Loading.className = "fa fa-refresh fa-spin";
  document.getElementById("bodydataS").innerHTML = "";
  await LoadInvoices();
  let BillNumber, BillDateS;
  if (isNaN(InvoicesData[0].Num) == false) {
    for (let index = 0; index < InvoicesData.length; index++) {
      BillNumber = InvoicesData[index].BillNumber;
      BillDateS = InvoicesData[index].BillDate;
      if (InvoicesData[index].Num != "") {
        if (SeaNumber.value != "") {
          if (BillNumber == SeaNumber.value) {
            AddRowPrS(
              InvoicesData[index].Num,
              InvoicesData[index].BillNumber,
              InvoicesData[index].BillDate,
              InvoicesData[index].AmountTotal,
              InvoicesData[index].MethodName,
              InvoicesData[index].MethodAmount,
              InvoicesData[index].Tax,
              InvoicesData[index].ShipType,
              InvoicesData[index].ShipAmount,
              InvoicesData[index].OtherCost,
              InvoicesData[index].AmountNet,
              InvoicesData[index].MethodNum,
              InvoicesData[index].ShipNum,
              InvoicesData[index].DesCountAmount,
              InvoicesData[index].Ready,
              InvoicesData[index].DesCountSel,
              InvoicesData[index].PlaceName,
              InvoicesData[index].PlacePrice,
            );
          }
        } else if (SeaDate.value != "") {
          if (GetDateFromString(BillDateS) == SeaDate.value) {
            AddRowPrS(
              InvoicesData[index].Num,
              InvoicesData[index].BillNumber,
              InvoicesData[index].BillDate,
              InvoicesData[index].AmountTotal,
              InvoicesData[index].MethodName,
              InvoicesData[index].MethodAmount,
              InvoicesData[index].Tax,
              InvoicesData[index].ShipType,
              InvoicesData[index].ShipAmount,
              InvoicesData[index].OtherCost,
              InvoicesData[index].AmountNet,
              InvoicesData[index].MethodNum,
              InvoicesData[index].ShipNum,
              InvoicesData[index].DesCountAmount,
              InvoicesData[index].Ready,
              InvoicesData[index].DesCountSel,
              InvoicesData[index].PlaceName,
              InvoicesData[index].PlacePrice,
            );
          }
        }
      }
    }
    AddRowTotal();
  }
  Loading.className = "fa fa-refresh";
}

// ***********************Mode*********************
function ConvertMode() {
  if (localStorage.getItem("FColor") == 1) {
    ConvertModeToSun();
  } else {
    ConvertModeToMoon();
  }
}

// function ConvertModeToSun() {
//   localStorage.setItem("FColor", 1);
//   document.getElementById("Moon").style.display = "inline-block";
//   document.getElementById("Sun").style.display = "none";
//   document.querySelector(":root").style.setProperty("--FColor", "wheat");
//   document.querySelector(":root").style.setProperty("--EColor", "white");
//   // document
//   //   .querySelector(":root")
//   //   .style.setProperty("--loginColor", "whitesmoke");
//   document.querySelector(":root").style.setProperty("--FontColor", "#f2a20b");
//   document.querySelector(":root").style.setProperty("--Font2Color", "#a53333");
//   document.querySelector(":root").style.setProperty("--Font3Color", "#a53333");
//   document.querySelector(":root").style.setProperty("--THColor", "wheat");
//   document.querySelector(":root").style.setProperty("--TDColor", "yellow");
// }
// function ConvertModeToMoon() {
//   localStorage.setItem("FColor", 2);
//   document.getElementById("Sun").style.display = "inline-block";
//   document.getElementById("Moon").style.display = "none";
//   document.querySelector(":root").style.setProperty("--FColor", "#141e30");
//   document.querySelector(":root").style.setProperty("--EColor", "#243b55");
//   // document
//   //   .querySelector(":root")
//   //   .style.setProperty("--loginColor", "#00000080");
//   document.querySelector(":root").style.setProperty("--FontColor", "white");
//   document.querySelector(":root").style.setProperty("--Font2Color", "#d3f6f8");
//   document.querySelector(":root").style.setProperty("--Font3Color", "black");
//   document.querySelector(":root").style.setProperty("--THColor", "gray");
//   document.querySelector(":root").style.setProperty("--TDColor", "Red");
// }

// Helper
function populateSelect(selectElm, data, keys) {
  selectElm.innerHTML = "";
  for (let index = 0; index < data.length; index++) {
    const value = data[index][keys.value];
    const label = data[index][keys.label];
    if (data[index][keys.value] != "") {
      optionClass = document.createElement("option");
      optionClass.value = value;
      optionClass.textContent = label;
      selectElm.appendChild(optionClass);
    }
  }
}

function calculatePaymentMethodFee(amount, paymentMethod) {
  return (
    amount -
    (paymentMethod.AmountMetod + (paymentMethod.PercentMetod / 100) * amount)
  );
}
