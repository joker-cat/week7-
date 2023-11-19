// Make a request for a user with a given ID
axios.get('https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json?token=AAQWFQDSNRRXC6FBW7PDSETBOESVW')
  .then(function (response) {
    // 一條長條圖：接案公司的薪資滿意度平均分數
    const filterCase = response.data.filter(e => e.company.industry === "接案公司");
    everageScore(filterCase, "#chart1");
    return response.data
  }).then(function (from) {
    // 二條長條圖：抓取博弈、電商公司兩個產業滿意度的平均分數
    const game = from.filter(e => e.company.industry === "博奕");
    const shop = from.filter(e => e.company.industry === "電子商務");
    everageScore(game, "#chart2");
    everageScore(shop, "#chart3");
    return from;
  }).then(function (from) {
    // 圓餅圖：撈取男性跟女性比例有多少
    const dataLength = from.length;
    const boyCount = from.filter(e => e.gender === "男性").length;
    const girlCount = dataLength - boyCount;
    pieChart([["男性", boyCount], ["女性", girlCount]], '#chart3');
    return from;
  }).then(function (from) {
    // 圓餅圖：顯示薪水區間分佈
    console.log(from);
    const salaryObj = from.reduce((acc, ipt) => {
      (ipt.company.salary) in acc ? acc[ipt.company.salary] += 1 : acc[ipt.company.salary] = 1;
      return acc;
    }, {})
    const rangesalary = Object.keys(salaryObj);
    const rangeCount = Object.values(salaryObj);
    const arr = [];
    for (let i = 0; i < rangesalary.length; i++) {
      arr.push([rangesalary[i],rangeCount[i]]);
    }
    pieChart(arr,'#chart4');
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    console.log('作題完成');
  });

function pieChart(arrData, id) {
  var chart = c3.generate({
    bindto: `${id}`,
    data: {
      columns: arrData,
      type: 'pie',
    }
  });
}

function everageScore(arrData, id) {
  const everage = arrData.reduce((acc, inp) => acc += parseInt(inp.company.salary_score), 0);
  const caseLength = arrData.length;
  whichChart(["接案公司的薪資滿意度平均分數", (everage / caseLength).toFixed(1)], id);
}

function whichChart(arrData, id) {
  var chart = c3.generate({
    bindto: `${id}`,
    data: {
      columns: [
        arrData
      ],
      type: 'bar'
    },
    bar: {
      width: {
        ratio: 0.2
      }
    },
    axis: {
      y: {
        label: { // ADD
          text: '平均分數',
          position: 'outer-middle'
        }
      }
    }
  });
}