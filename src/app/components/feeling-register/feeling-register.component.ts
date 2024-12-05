import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  LineController,
  LineElement,
} from 'chart.js';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Registrar os componentes necessários
Chart.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


@Component({
  selector: 'app-feeling-register',
  templateUrl: './feeling-register.component.html',
  styleUrls: ['./feeling-register.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FeelingRegisterComponent implements OnInit {
  private messageMap: { [key: string]: string } = {
    'feliz': 'Aproveite cada momento e compartilhe sua felicidade!',
    'calmo': 'Respire e aproveite o momento!',
    'ansioso': 'Tente respirar e concentre-se no presente.',
    'irritado': 'Não permita que a raiva controle seu dia.',
    'triste': 'Tudo bem não se sentir bem hoje. Lembre-se, o importante é continuar.',
    'null': 'Tudo bem não se sentir bem hoje. Lembre-se, o importante é continuar.',
  };
  chatMessages: Array<{ message: string, type: string }> = [];
  user: any;
  unparsedUser: any;

  lineChartData = {
    labels: [] as string[], // Aqui irão os dias do mês
    datasets: [
      {
        label:'',
        data: [] as number[], // Dados dos humores durante o mês
        borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
        fill: false, // Não preenche a área abaixo da linha
        tension: 0.1, // Suaviza a linha
        borderWidth: 2
      },
    ],
  };

  chartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: '',
        data: [] as number[], // Dados do gráfico
        pointStyle: [] as any, // Dados do gráfico
        backgroundColor: [] as any, // Cor de fundo
        borderColor: 'rgba(229, 230, 250, 1)', // Cor da borda
        borderWidth: 1,
      },
    ],
  };

  private chartLine: any;
  private chartBar: any;
  chartAvailable: boolean = false;
  errorMessage: string = '';
  todayFeeling: any

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.unparsedUser = localStorage.getItem('user');
    this.user = JSON.parse(this.unparsedUser);

    if (!this.user) {
      console.error('Usuário não está logado ou dados não encontrados!');
      return; // Evita erros se o usuário não estiver logado
    }

    this.authService.getFeelings().subscribe(
      (feelingsByDay) => {
        console.log(feelingsByDay['message']);
        if (feelingsByDay['message'] == 'Nenhuma emoção registrada esta semana') {
          console.log(feelingsByDay['message']);
          this.errorMessage =feelingsByDay['message']; // Define a mensagem de erro
          this.chartAvailable = false; // Não exibe o gráfico
        } else {
        this.chartData.datasets[0].data = this.mapFeelingsToGraph(feelingsByDay);
        this.chartData.datasets[0].backgroundColor = this.chartData.labels.map((day) => {
          const feeling = feelingsByDay[day];
          const emotionColors: { [key in 'feliz' | 'calmo' | 'ansioso' | 'irritado' | 'triste' | 'null']: string } = {
            feliz: 'rgba(255, 201, 83, 0.8)',
            calmo: 'rgba(40, 170, 156, 0.6)',
            ansioso: 'rgba(244, 108, 51, 0.6)',
            irritado: 'rgba(255, 99, 132, 0.8)',
            triste: 'rgba(26, 158, 202, 0.6)',
            null: 'rgba(201, 203, 207, 0.6)', // Caso sem dado registrado
          };
          
          this.chartAvailable = true;

          
          this.createChart();
          return emotionColors[feeling as keyof typeof emotionColors] || emotionColors.null;
     
        });}

      // Identifica o humor de hoje
      const today = new Date().toLocaleDateString('en-CA', { weekday: 'long' }); // Obtém o dia da semana no formato 'Monday', etc.
      const feelingToday = feelingsByDay[today] || null;
      if (feelingToday) {
        const emotionMap: { [key: string]: string } = {
          feliz: 'Feliz',
          calmo: 'Calmo',
          ansioso: 'Ansioso',
          irritado: 'Irritado',
          triste: 'Triste',
        };
        const imageMap: { [key: string]: string } = this.imageMap;

        this.todayFeeling = {
          feeling: feelingToday || 'Outro',
          image: imageMap[feelingToday],
          message: this.messageMap[feelingToday] || 'Você está fazendo o seu melhor. Continue assim!',

        };
      } else {
        this.todayFeeling = null;
      }
    },


      (error) => {
        console.error('Erro ao obter sentimentos:', error);
          this.errorMessage = 'Não foi possível carregar os dados no momento.';
          this.chartAvailable = false;
      }
    );
    this.authService.getFeelingsByMonth().subscribe(
      (feelingsByMonth) => {
        console.log(feelingsByMonth);
    this.lineChartData.datasets[0].data = this.mapFeelingsToGraphMonth(feelingsByMonth);
          this.lineChartData.labels = this.getDaysOfMonth(); // Adiciona os dias do mês
          this.createLineChart();
  });
  }



  // Obter os dias do mês atual (1 a 31)
  private getDaysOfMonth(): string[] {
    const days = [];
    const date = new Date();
    const numDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Total de dias no mês
    for (let i = 1; i <= numDays; i++) {
      days.push(i.toString());
    }
    return days;
  }

  private imageMap = {
    'triste': 'assets/feelings/sad.png',  // Caminho da imagem para o sentimento "Triste"
    'ansioso': 'assets/feelings/thinking.png', // Caminho da imagem para o sentimento "Ansioso"
    'irritado': 'assets/feelings/angry.png',   // Caminho da imagem para o sentimento "Bravo"
    'feliz': 'assets/feelings/smile.png',   // Caminho da imagem para o sentimento "Feliz"
    'calmo': 'assets/feelings/lol.png',   // Caminho da imagem para o sentimento "Calmo"
  };


  
  // Mapear sentimentos para números para o gráfico
  private mapFeelingsToGraph(feelingsByDay: { [key: string]: string | null }): number[] {
    const emotionMap: { [key: string]: number } = {
      'feliz': 5,
      'calmo': 4,
      'ansioso': 3,
      'irritado': 2,
      'triste': 1,
      null: 0, // Sem dado registrado
    };
    return this.chartData.labels.map((day) => {
      const feeling = feelingsByDay[day]; // Obtém o sentimento para o dia atual
      return feeling !== null ? emotionMap[feeling] || 0 : 0; // Trata o caso de null
    });
  }

  private mapFeelingsToGraphMonth(feelingsByMonth: { [key: string]: string | null }): number[] {
    const emotionMap: { [key: string]: number } = {
      'feliz': 5,
      'calmo': 4,
      'ansioso': 3,
      'irritado': 2,
      'triste': 1,
    };
    
    const numDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const graphData: number[] = new Array(numDays).fill(null); // Preenche com null por padrão
    
    for (const day in feelingsByMonth) {
      const dayIndex = parseInt(day, 10) - 1;
      const feeling = feelingsByMonth[day] || 'null';
      graphData[dayIndex] = emotionMap[feeling as keyof typeof emotionMap];
    }
    
    return graphData.filter(data => data !== null); // Filtra os valores nulos
  }
    
  
  
  private createChart(): void {

    setTimeout(() => {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Elemento canvas não encontrado!');
        return;
      }
    const emotionMap: { [key: number]: string } = {
      1: '🙁 Triste',
      3: '😟 Ansioso',
      2: '😡 Irritado',
      5: '😊 Feliz',
      4: '😌 Calmo',
    };

    if (this.chartBar) {
      this.chartBar.destroy();
    }

    this.chartBar = new Chart('canvas', {
      type: 'bar', // Tipo de gráfico
      data: {
        labels: this.chartData.labels,
        datasets: this.chartData.datasets,
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          labels: {
            font: {
              size: 16, // Define o tamanho da fonte da legenda
            }}},
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw as number; // Valor do dado
                return emotionMap[value]; // Usa o mapeamento centralizado
                },  
              },  
            }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 14, // Aumenta o tamanho dos rótulos do eixo X (humores)
              },
              callback: function(value) {
                const index = Number(value);
                return emotionMap[index] || '';}}
          },
          y: {
            // Modificando apenas os rótulos do eixo X
            ticks: {
              font: {
                size: 14, // Aumenta o tamanho dos rótulos do eixo X (humores)
              },
              callback: (value: any) => {
                const labelsMap: { [key: string]: string } = {
                  0: 'Segunda',
                  1: 'Terça',
                  2: 'Quarta',
                  3: 'Quinta',
                  4: 'Sexta',
                  5: 'Sábado',
                  6: 'Domingo'
                };
                return labelsMap[value] || value; // Converte o nome do dia para português
              
              }
            }
          }
        },


      }
    }
  )
  this.createLineChart(); // Cria o gráfico de linha
}, 0);}


  // Criar gráfico mensal
private createLineChart(): void {
  const emotionMap: { [key: number]: string } = {
    1: '🙁 Triste',
    3: '😟 Ansioso',
    2: '😡 Irritado',
    5: '😊 Feliz',
    4: '😌 Calmo',
    0: '🤨 Outro'
  };

  const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Elemento canvas não encontrado para o gráfico mensal!');
    return;
  }

  if (this.chartLine) {
    this.chartLine.destroy();
  }
  this.chartLine = new Chart(canvas, {
    type: 'line', // Tipo de gráfico
    data: this.lineChartData,
  
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins:{
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw as number; // Valor do dado
              return emotionMap[value]; // Usa o mapeamento centralizado
              },  
            },  
          },
        legend: {
        display: false
      },
      },
      // Adicione opções específicas para o gráfico mensal se necessário
      scales: {
        y: {
          ticks: {
            font: {
              size: 14, // Aumenta o tamanho dos rótulos do eixo X (humores)
            },
            callback: function(value) {
              const index = Number(value);
              return emotionMap[index] || '';}}
        },},
  }});
}

chatbot(){
  this.router.navigate(['chatbot']);
}

refresh(): void {
  window.location.reload();
}

logout(): void {
  localStorage.clear();
  this.router.navigate(['login']);

}

}
