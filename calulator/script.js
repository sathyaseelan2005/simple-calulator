(function(){
const historyEl = document.getElementById('history');
const outputEl = document.getElementById('output');
let expression = '';
let lastResult = null;


function updateDisplay(){
historyEl.textContent = expression || '\u00A0';
outputEl.textContent = expression ? expression.slice(-32) : '0';
}


function append(char){
// prevent multiple leading zeros
if(char === '.' && /\.[0-9]*$/.test(expression)) return;
// prevent two operators in a row (except minus for negative numbers)
if(/[+\-*/%]$/.test(expression) && /[+\-*/%]/.test(char)){
expression = expression.slice(0, -1) + char;
} else {
expression += char;
}
updateDisplay();
}


function backspace(){ expression = expression.slice(0,-1); updateDisplay(); }
function clearAll(){ expression=''; lastResult=null; updateDisplay(); }


function compute(){
if(!expression) return;
const safeExpr = expression.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
try{
if(!/^[0-9+\-*/%.()\s]+$/.test(safeExpr)) throw new Error('Invalid characters');
const result = Function('return (' + safeExpr + ')')();
if(!isFinite(result)) throw new Error('Result not finite');
lastResult = result;
expression = String(result);
} catch(e){
expression = '';
outputEl.textContent = 'Error';
setTimeout(()=>{ updateDisplay(); }, 800);
return;
}
updateDisplay();
}


// handle button clicks
document.querySelectorAll('button').forEach(btn=>{
btn.addEventListener('click', ()=>{
const val = btn.getAttribute('data-value');
const action = btn.getAttribute('data-action');
if(action === 'clear') clearAll();
else if(action === 'back') backspace();
else if(action === 'equals') compute();
else if(val) append(val);
});
});


// keyboard support
window.addEventListener('keydown', (e)=>{
if(e.key === 'Escape') { e.preventDefault(); clearAll(); return; }
if(e.key === 'Backspace') { e.preventDefault(); backspace(); return; }
if(e.key === 'Enter' || e.key === '=') { e.preventDefault(); compute(); return; }
});
})();