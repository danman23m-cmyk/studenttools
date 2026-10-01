
function $(id){return document.getElementById(id)}
function num(id){return parseFloat($(id).value)}
function show(id,msg){const el=$(id);el.innerHTML=msg;el.classList.add('show')}
function fmt(n,d=2){return Number(n).toLocaleString(undefined,{maximumFractionDigits:d})}

function grade(){
 const earned=num('earned'), total=num('total');
 if(total<=0)return show('result','Enter a valid total.');
 const p=earned/total*100;
 show('result',`<span class="big">${fmt(p,1)}%</span>Your grade percentage`);
}
function finalGrade(){
 const current=num('current'), weight=num('weight'), desired=num('desired');
 if(weight<0||weight>100||desired<0||desired>100)return show('result','Use percentages from 0 to 100.');
 const needed=(desired-current*(1-weight/100))/(weight/100);
 show('result',`<span class="big">${fmt(needed,1)}%</span>Needed on the remaining work`);
}
function gpa(){
 const vals=[num('g1'),num('g2'),num('g3'),num('g4')];
 if(vals.some(x=>isNaN(x)||x<0||x>4))return show('result','Enter GPA values from 0 to 4.');
 const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
 show('result',`<span class="big">${fmt(avg,2)}</span>Estimated GPA`);
}
function weightedGpa(){
 const grades=[num('wg1'),num('wg2'),num('wg3')], credits=[num('c1'),num('c2'),num('c3')];
 if(grades.some(x=>x<0||x>4)||credits.some(x=>x<=0))return show('result','Check your grades and credit hours.');
 const total=credits.reduce((a,b)=>a+b,0);
 const avg=grades.reduce((s,g,i)=>s+g*credits[i],0)/total;
 show('result',`<span class="big">${fmt(avg,2)}</span>Credit-weighted GPA`);
}
function percent(){
 const part=num('part'), whole=num('whole');
 if(whole===0)return show('result','The total cannot be zero.');
 show('result',`<span class="big">${fmt(part/whole*100,2)}%</span>${fmt(part,2)} is this percentage of ${fmt(whole,2)}.`);
}
function change(){
 const oldv=num('oldv'), newv=num('newv');
 if(oldv===0)return show('result','The original value cannot be zero.');
 const p=(newv-oldv)/Math.abs(oldv)*100;
 show('result',`<span class="big">${p>=0?'+':''}${fmt(p,2)}%</span>${p>=0?'Increase':'Decrease'}`);
}
function exam(){
 const current=num('ecurrent'), weight=num('eweight'), target=num('etarget');
 const needed=(target-current*(1-weight/100))/(weight/100);
 show('result',`<span class="big">${fmt(needed,1)}%</span>Needed on the exam`);
}
function needed(){
 const current=num('ncurrent'), completed=num('ncompleted'), target=num('ntarget');
 if(completed<0||completed>=100)return show('result','Completed percentage must be between 0 and 100.');
 const remaining=100-completed;
 const req=(target-current*(completed/100))/(remaining/100);
 show('result',`<span class="big">${fmt(req,1)}%</span>Average needed on remaining work`);
}
function study(){
 const minutes=num('minutes'), sessions=num('sessions');
 if(minutes<=0||sessions<=0)return show('result','Enter positive values.');
 const total=minutes*sessions;
 show('result',`<span class="big">${fmt(total/60,1)} hours</span>${fmt(total)} total study minutes`);
}
function countdown(){
 const date=$( 'date').value;
 if(!date)return show('result','Choose a date.');
 const target=new Date(date+'T23:59:59'), now=new Date();
 const diff=target-now;
 if(diff<=0)return show('result','That date has already passed.');
 const days=Math.floor(diff/86400000), hrs=Math.floor(diff%86400000/3600000);
 show('result',`<span class="big">${days}d ${hrs}h</span>Until your date`);
}
