function $(id){
  return document.getElementById(id);
}

function num(id){
  return parseFloat($(id).value);
}

function show(id,msg){
  const el=$(id);
  el.innerHTML=msg;
  el.classList.add('show');
}

function fmt(n,d=2){
  return Number(n).toLocaleString(undefined,{
    maximumFractionDigits:d
  });
}


/* =========================
   GRADE CALCULATOR
========================= */

function grade(){

  const earned=num('earned');
  const total=num('total');

  if(total<=0)
    return show('result','Enter a valid total.');

  const p=earned/total*100;

  show(
    'result',
    `<span class="big">${fmt(p,1)}%</span>Your grade percentage`
  );
}


/* =========================
   FINAL GRADE CALCULATOR
========================= */

function finalGrade(){

  const current=num('current');
  const weight=num('weight');
  const desired=num('desired');

  if(
    weight<0 ||
    weight>100 ||
    desired<0 ||
    desired>100
  ){
    return show(
      'result',
      'Use percentages from 0 to 100.'
    );
  }

  const needed=
    (desired-current*(1-weight/100))
    /(weight/100);

  show(
    'result',
    `<span class="big">${fmt(needed,1)}%</span>Needed on the remaining work`
  );
}


/* =========================
   GPA CALCULATOR
========================= */

const GPA_POINTS={

  'A+':4.0,
  'A':4.0,
  'A-':3.7,

  'B+':3.3,
  'B':3.0,
  'B-':2.7,

  'C+':2.3,
  'C':2.0,
  'C-':1.7,

  'D+':1.3,
  'D':1.0,
  'D-':0.7,

  'F':0.0

};


function initGpaCalculator(){

  if(!document.getElementById('courseRows'))
    return;

  resetGpa();

}


function addCourse(defaults={}){

  const tbody=
    document.getElementById('courseRows');

  if(!tbody)
    return;

  const index=
    tbody.children.length+1;

  const row=
    document.createElement('tr');

  row.className='course-row';

  row.innerHTML=`

    <td>

      <input
        class="course-name"
        type="text"
        placeholder="Course ${index}"
        aria-label="Course name">

    </td>

    <td>

      <select
        class="course-grade"
        aria-label="Letter grade">

        <option value="">
          Select
        </option>

        ${Object.keys(GPA_POINTS)
          .map(g =>
            `<option value="${g}">
              ${g} (${GPA_POINTS[g].toFixed(1)})
            </option>`
          )
          .join('')}

      </select>

    </td>

    <td>

      <input
        class="course-credits"
        type="number"
        min="0"
        step="0.5"
        placeholder="3"
        aria-label="Credit hours">

    </td>

    <td>

      <button
        class="remove-btn"
        type="button"
        onclick="removeCourse(this)"
        aria-label="Remove course">

        ×

      </button>

    </td>

  `;

  tbody.appendChild(row);


  if(defaults.grade){

    row.querySelector(
      '.course-grade'
    ).value=defaults.grade;

  }


  if(defaults.credits!=null){

    row.querySelector(
      '.course-credits'
    ).value=defaults.credits;

  }

}


function removeCourse(button){

  const tbody=
    document.getElementById('courseRows');

  if(!tbody)
    return;


  if(tbody.children.length<=1){

    const row=tbody.children[0];

    row.querySelector(
      '.course-name'
    ).value='';

    row.querySelector(
      '.course-grade'
    ).value='';

    row.querySelector(
      '.course-credits'
    ).value='';

    return;

  }


  button.closest('tr').remove();

}


function resetGpa(){

  const tbody=
    document.getElementById('courseRows');

  if(!tbody)
    return;


  tbody.innerHTML='';


  /*
    Start with four courses.
    Users can add unlimited additional courses.
  */

  addCourse();
  addCourse();
  addCourse();
  addCourse();


  const prev=
    document.getElementById('previousGpa');

  const prevCredits=
    document.getElementById('previousCredits');


  if(prev)
    prev.value='';

  if(prevCredits)
    prevCredits.value='';


  const result=
    document.getElementById('result');


  if(result){

    result.innerHTML='';
    result.classList.remove('show');

  }


  const cumulative=
    document.getElementById(
      'cumulativeResult'
    );


  if(cumulative){

    cumulative.innerHTML='';
    cumulative.classList.remove('show');

  }

}


function gpa(){

  const rows=[
    ...document.querySelectorAll(
      '#courseRows .course-row'
    )
  ];


  let quality=0;
  let credits=0;
  let count=0;


  for(const row of rows){

    const grade=
      row.querySelector(
        '.course-grade'
      ).value;


    const credit=
      parseFloat(
        row.querySelector(
          '.course-credits'
        ).value
      );


    /*
      Ignore completely empty rows.
    */

    if(
      !grade &&
      !Number.isFinite(credit)
    ){
      continue;
    }


    /*
      Partially completed rows must be fixed.
    */

    if(
      !grade ||
      !Number.isFinite(credit) ||
      credit<=0
    ){

      return show(
        'result',
        'Complete the grade and enter positive credits for each course you want to count.'
      );

    }


    quality +=
      GPA_POINTS[grade] * credit;

    credits += credit;

    count++;

  }


  if(
    !count ||
    credits<=0
  ){

    return show(
      'result',
      'Add at least one course with a letter grade and credit hours.'
    );

  }


  const avg=
    quality/credits;


  show(
    'result',
    `<span class="big">${fmt(avg,2)}</span>
     ${count} course${count===1?'':'s'}
     · ${fmt(credits,1)} total credits
     · ${fmt(quality,2)} quality points`
  );

}


/* =========================
   CUMULATIVE GPA
========================= */

function calculateCumulativeGpa(){

  let previous=
    num('previousGpa');

  let previousCredits=
    num('previousCredits');


  if(
    !Number.isFinite(previousCredits) ||
    previousCredits<0
  ){

    return show(
      'cumulativeResult',
      'Enter previous completed credits of 0 or more.'
    );

  }


  /*
    If previous credits are zero,
    treat blank previous GPA as zero.
  */

  if(
    previousCredits===0 &&
    !Number.isFinite(previous)
  ){

    previous=0;

  }


  if(
    !Number.isFinite(previous) ||
    previous<0 ||
    previous>4
  ){

    return show(
      'cumulativeResult',
      'Enter a previous GPA from 0 to 4 and completed credits of 0 or more.'
    );

  }


  const rows=[
    ...document.querySelectorAll(
      '#courseRows .course-row'
    )
  ];


  let newQuality=0;
  let newCredits=0;


  for(const row of rows){

    const grade=
      row.querySelector(
        '.course-grade'
      ).value;


    const credit=
      parseFloat(
        row.querySelector(
          '.course-credits'
        ).value
      );


    if(
      !grade &&
      !Number.isFinite(credit)
    ){

      continue;

    }


    if(
      !grade ||
      !Number.isFinite(credit) ||
      credit<=0
    ){

      return show(
        'cumulativeResult',
        'Complete the grade and credits for each course you want to count.'
      );

    }


    newQuality +=
      GPA_POINTS[grade] * credit;

    newCredits += credit;

  }


  const totalCredits=
    previousCredits + newCredits;


  if(totalCredits<=0){

    return show(
      'cumulativeResult',
      'Add previous credits or at least one new course.'
    );

  }


  const cumulative=
    (
      previous*previousCredits +
      newQuality
    ) / totalCredits;


  show(
    'cumulativeResult',
    `<span class="big">${fmt(cumulative,2)}</span>
     ${fmt(totalCredits,1)} total credits after this term`
  );

}


/* =========================
   WEIGHTED GPA CALCULATOR
========================= */

function weightedGpa(){

  const grades=[
    num('wg1'),
    num('wg2'),
    num('wg3')
  ];

  const credits=[
    num('c1'),
    num('c2'),
    num('c3')
  ];


  if(
    grades.some(x=>x<0||x>4) ||
    credits.some(x=>x<=0)
  ){

    return show(
      'result',
      'Check your grades and credit hours.'
    );

  }


  const total=
    credits.reduce(
      (a,b)=>a+b,
      0
    );


  const avg=
    grades.reduce(
      (s,g,i)=>s+g*credits[i],
      0
    ) / total;


  show(
    'result',
    `<span class="big">${fmt(avg,2)}</span>Credit-weighted GPA`
  );

}


/* =========================
   PERCENTAGE CALCULATOR
========================= */

function percent(){

  const part=num('part');
  const whole=num('whole');


  if(whole===0)
    return show(
      'result',
      'The total cannot be zero.'
    );


  show(
    'result',
    `<span class="big">${fmt(part/whole*100,2)}%</span>
     ${fmt(part,2)} is this percentage of ${fmt(whole,2)}.`
  );

}


/* =========================
   PERCENT CHANGE
========================= */

function change(){

  const oldv=num('oldv');
  const newv=num('newv');


  if(oldv===0)
    return show(
      'result',
      'The original value cannot be zero.'
    );


  const p=
    (newv-oldv) /
    Math.abs(oldv) *
    100;


  show(
    'result',
    `<span class="big">
      ${p>=0?'+':''}${fmt(p,2)}%
     </span>
     ${p>=0?'Increase':'Decrease'}`
  );

}


/* =========================
   EXAM GRADE
========================= */

function exam(){

  const current=num('ecurrent');
  const weight=num('eweight');
  const target=num('etarget');


  const needed=
    (
      target -
      current*(1-weight/100)
    ) /
    (weight/100);


  show(
    'result',
    `<span class="big">${fmt(needed,1)}%</span>
     Needed on the exam`
  );

}


/* =========================
   WHAT GRADE DO I NEED?
========================= */

function needed(){

  const current=num('ncurrent');
  const completed=num('ncompleted');
  const target=num('ntarget');


  if(
    completed<0 ||
    completed>=100
  ){

    return show(
      'result',
      'Completed percentage must be between 0 and 100.'
    );

  }


  const remaining=
    100-completed;


  const req=
    (
      target -
      current*(completed/100)
    ) /
    (remaining/100);


  show(
    'result',
    `<span class="big">${fmt(req,1)}%</span>
     Average needed on remaining work`
  );

}


/* =========================
   STUDY TIME
========================= */

function study(){

  const minutes=num('minutes');
  const sessions=num('sessions');


  if(
    minutes<=0 ||
    sessions<=0
  ){

    return show(
      'result',
      'Enter positive values.'
    );

  }


  const total=
    minutes*sessions;


  show(
    'result',
    `<span class="big">${fmt(total/60,1)} hours</span>
     ${fmt(total)} total study minutes`
  );

}


/* =========================
   EXAM COUNTDOWN
========================= */

function countdown(){

  const date=$('date').value;


  if(!date)
    return show(
      'result',
      'Choose a date.'
    );


  const target=
    new Date(
      date+'T23:59:59'
    );

  const now=
    new Date();


  const diff=
    target-now;


  if(diff<=0)
    return show(
      'result',
      'That date has already passed.'
    );


  const days=
    Math.floor(
      diff/86400000
    );


  const hrs=
    Math.floor(
      diff%86400000/3600000
    );


  show(
    'result',
    `<span class="big">
      ${days}d ${hrs}h
     </span>
     Until your date`
  );

}

