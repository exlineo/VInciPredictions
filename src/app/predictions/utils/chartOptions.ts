export const options = (rd:string, an:string, legende:boolean, align:string='left', min?:number, max?:number) => {
  return{
    responsive:true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: legende,
        position:'top',
        align:'center',
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
          minRotation: 45,
          maxRotation: 45
        },
        grid: {
          color: '#ebedef'
        },
        title: {
          color: '#ebedef',
          display: true,
          text: an
        }
      },
      y: {
        min:min,
        max:max,
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        },
        title: {
          color: '#ebedef',
          display: true,
          text: rd
        },
        position:align
      }
    }
  }
}
