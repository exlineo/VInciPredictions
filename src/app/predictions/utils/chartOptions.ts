export const options = (rd:string, an:string, align:string='left', min?:number, max?:number)=> {
  return{
    responsive:true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
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
