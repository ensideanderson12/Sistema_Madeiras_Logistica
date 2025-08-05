/**
 * Charts Module - Sistema Madeiras Logística
 * Geração de gráficos interativos usando Chart.js
 */

class ChartsManager {
    constructor() {
        this.charts = {};
        this.initializeCharts();
        this.loadChartData();
        this.setupChartUpdates();
    }

    /**
     * Inicializa todos os gráficos
     */
    initializeCharts() {
        // Load Chart.js via CDN if not available
        if (typeof Chart === 'undefined') {
            this.loadChartJS().then(() => {
                this.createCharts();
            });
        } else {
            this.createCharts();
        }
    }

    /**
     * Carrega Chart.js via CDN
     */
    loadChartJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Cria todos os gráficos
     */
    createCharts() {
        this.createRevenueChart();
        this.createCostsChart();
    }

    /**
     * Cria gráfico de receita
     */
    createRevenueChart() {
        const ctx = document.getElementById('revenue-chart');
        if (!ctx) return;

        const data = this.generateRevenueData();
        
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Receita (R$)',
                    data: data.revenue,
                    borderColor: '#2E7D32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Lucro Líquido (R$)',
                    data: data.profit,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '📈 Evolução de Receita e Lucro',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                       new Intl.NumberFormat('pt-BR', {
                                           style: 'currency',
                                           currency: 'BRL'
                                       }).format(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Período'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor (R$)'
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(value);
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    /**
     * Cria gráfico de custos
     */
    createCostsChart() {
        const ctx = document.getElementById('costs-chart');
        if (!ctx) return;

        const data = this.generateCostsData();
        
        this.charts.costs = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#FF6384', // Combustível
                        '#36A2EB', // Motorista
                        '#FFCE56', // Pedágios
                        '#4BC0C0', // Manutenção
                        '#9966FF', // Seguro
                        '#FF9F40'  // Outros
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '🍰 Distribuição de Custos Operacionais',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                
                                return `${label}: ${new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Gera dados simulados de receita
     */
    generateRevenueData() {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const baseRevenue = 150000;
        const baseProfit = 45000;
        
        const revenue = months.map((_, index) => {
            const growth = 1 + (index * 0.08); // 8% crescimento mensal
            const variation = 0.9 + (Math.random() * 0.2); // ±10% variação
            return Math.round(baseRevenue * growth * variation);
        });

        const profit = revenue.map(rev => {
            const profitMargin = 0.25 + (Math.random() * 0.1); // 25-35% margem
            return Math.round(rev * profitMargin);
        });

        return {
            labels: months,
            revenue,
            profit
        };
    }

    /**
     * Gera dados simulados de custos
     */
    generateCostsData() {
        // Dados baseados em uma operação típica
        const costs = {
            'Combustível': 18500,
            'Motorista': 12000,
            'Pedágios': 8500,
            'Manutenção': 6500,
            'Seguro': 4200,
            'Outros': 3800
        };

        return {
            labels: Object.keys(costs),
            values: Object.values(costs)
        };
    }

    /**
     * Carrega dados históricos dos gráficos
     */
    loadChartData() {
        // Carrega dados do localStorage se disponível
        const savedData = localStorage.getItem('chartHistoricalData');
        if (savedData) {
            this.historicalData = JSON.parse(savedData);
        } else {
            this.historicalData = this.generateInitialHistoricalData();
            this.saveChartData();
        }
    }

    /**
     * Gera dados históricos iniciais
     */
    generateInitialHistoricalData() {
        const data = {
            revenue: [],
            costs: [],
            roi: [],
            operations: []
        };

        // Gera últimos 30 dias de dados
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            data.revenue.push({
                date: date.toISOString().split('T')[0],
                value: 120000 + (Math.random() * 60000)
            });
            
            data.costs.push({
                date: date.toISOString().split('T')[0],
                value: 80000 + (Math.random() * 20000)
            });
            
            data.roi.push({
                date: date.toISOString().split('T')[0],
                value: 10 + (Math.random() * 15)
            });
            
            data.operations.push({
                date: date.toISOString().split('T')[0],
                value: 8 + Math.floor(Math.random() * 8)
            });
        }

        return data;
    }

    /**
     * Salva dados dos gráficos
     */
    saveChartData() {
        localStorage.setItem('chartHistoricalData', JSON.stringify(this.historicalData));
    }

    /**
     * Configura atualizações automáticas dos gráficos
     */
    setupChartUpdates() {
        // Atualiza gráficos a cada 5 minutos
        setInterval(() => {
            this.updateCharts();
        }, 300000);

        // Atualiza na mudança de seção
        document.addEventListener('sectionChange', () => {
            setTimeout(() => this.resizeCharts(), 100);
        });
    }

    /**
     * Atualiza dados dos gráficos
     */
    updateCharts() {
        if (this.charts.revenue) {
            this.updateRevenueChart();
        }
        
        if (this.charts.costs) {
            this.updateCostsChart();
        }
    }

    /**
     * Atualiza gráfico de receita
     */
    updateRevenueChart() {
        const newData = this.generateRevenueData();
        
        this.charts.revenue.data.labels = newData.labels;
        this.charts.revenue.data.datasets[0].data = newData.revenue;
        this.charts.revenue.data.datasets[1].data = newData.profit;
        
        this.charts.revenue.update('none');
    }

    /**
     * Atualiza gráfico de custos
     */
    updateCostsChart() {
        const newData = this.generateCostsData();
        
        this.charts.costs.data.datasets[0].data = newData.values;
        this.charts.costs.update('none');
    }

    /**
     * Redimensiona gráficos
     */
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    /**
     * Adiciona ponto de dados aos gráficos
     */
    addDataPoint(type, value) {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.historicalData[type]) {
            this.historicalData[type] = [];
        }
        
        this.historicalData[type].push({
            date: today,
            value: value
        });

        // Manter apenas últimos 30 dias
        if (this.historicalData[type].length > 30) {
            this.historicalData[type].shift();
        }

        this.saveChartData();
    }

    /**
     * Exporta gráficos como imagem
     */
    exportChart(chartName, format = 'png') {
        const chart = this.charts[chartName];
        if (!chart) return;

        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = `${chartName}-chart.${format}`;
        link.href = url;
        link.click();
    }

    /**
     * Cria gráfico de comparação personalizado
     */
    createComparisonChart(containerId, data, options = {}) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return;

        const defaultOptions = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: options.title || 'Gráfico de Comparação'
                    }
                }
            }
        };

        return new Chart(ctx, { ...defaultOptions, ...options });
    }

    /**
     * Gera relatório de performance em gráficos
     */
    generatePerformanceReport() {
        const report = {
            period: '30 dias',
            totalRevenue: this.historicalData.revenue.reduce((sum, item) => sum + item.value, 0),
            totalCosts: this.historicalData.costs.reduce((sum, item) => sum + item.value, 0),
            averageROI: this.historicalData.roi.reduce((sum, item) => sum + item.value, 0) / this.historicalData.roi.length,
            totalOperations: this.historicalData.operations.reduce((sum, item) => sum + item.value, 0),
            trends: this.calculateTrends()
        };

        report.netProfit = report.totalRevenue - report.totalCosts;
        report.profitMargin = (report.netProfit / report.totalRevenue) * 100;

        return report;
    }

    /**
     * Calcula tendências dos dados
     */
    calculateTrends() {
        const trends = {};

        ['revenue', 'costs', 'roi', 'operations'].forEach(type => {
            const data = this.historicalData[type];
            if (data.length < 2) {
                trends[type] = 0;
                return;
            }

            const recent = data.slice(-7).reduce((sum, item) => sum + item.value, 0) / 7;
            const previous = data.slice(-14, -7).reduce((sum, item) => sum + item.value, 0) / 7;
            
            trends[type] = ((recent - previous) / previous) * 100;
        });

        return trends;
    }

    /**
     * Cria gráfico de tendências
     */
    createTrendChart(containerId, dataType) {
        const ctx = document.getElementById(containerId);
        if (!ctx || !this.historicalData[dataType]) return;

        const data = this.historicalData[dataType];
        
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => new Date(item.date).toLocaleDateString('pt-BR')),
                datasets: [{
                    label: this.getDataTypeLabel(dataType),
                    data: data.map(item => item.value),
                    borderColor: this.getDataTypeColor(dataType),
                    backgroundColor: this.getDataTypeColor(dataType, 0.1),
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Tendência de ${this.getDataTypeLabel(dataType)} (30 dias)`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (dataType === 'revenue' || dataType === 'costs') {
                                    return new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                        minimumFractionDigits: 0
                                    }).format(value);
                                } else if (dataType === 'roi') {
                                    return value.toFixed(1) + '%';
                                } else {
                                    return value;
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Obtém label para tipo de dados
     */
    getDataTypeLabel(dataType) {
        const labels = {
            revenue: 'Receita',
            costs: 'Custos',
            roi: 'ROI',
            operations: 'Operações'
        };
        return labels[dataType] || dataType;
    }

    /**
     * Obtém cor para tipo de dados
     */
    getDataTypeColor(dataType, alpha = 1) {
        const colors = {
            revenue: `rgba(46, 125, 50, ${alpha})`,
            costs: `rgba(244, 67, 54, ${alpha})`,
            roi: `rgba(255, 193, 7, ${alpha})`,
            operations: `rgba(33, 150, 243, ${alpha})`
        };
        return colors[dataType] || `rgba(128, 128, 128, ${alpha})`;
    }

    /**
     * Destroy all charts
     */
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Fallback simples se Chart.js não estiver disponível
class SimpleChartsManager {
    constructor() {
        this.createSimpleCharts();
    }

    createSimpleCharts() {
        this.createSimpleRevenueChart();
        this.createSimpleCostsChart();
    }

    createSimpleRevenueChart() {
        const container = document.getElementById('revenue-chart');
        if (!container) return;

        container.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #f5f5f5; border-radius: 8px;">
                <h3>📈 Receita e Lucro</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-top: 16px;">
                    <div style="background: white; padding: 16px; border-radius: 4px; border-left: 4px solid #2E7D32;">
                        <div style="font-size: 1.2rem; font-weight: bold; color: #2E7D32;">R$ 187.500</div>
                        <div style="font-size: 0.9rem; color: #666;">Receita Mensal</div>
                    </div>
                    <div style="background: white; padding: 16px; border-radius: 4px; border-left: 4px solid #4CAF50;">
                        <div style="font-size: 1.2rem; font-weight: bold; color: #4CAF50;">R$ 56.250</div>
                        <div style="font-size: 0.9rem; color: #666;">Lucro Mensal</div>
                    </div>
                </div>
                <div style="margin-top: 16px; font-size: 0.8rem; color: #888;">
                    * Para gráficos interativos, carregue Chart.js
                </div>
            </div>
        `;
    }

    createSimpleCostsChart() {
        const container = document.getElementById('costs-chart');
        if (!container) return;

        container.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #f5f5f5; border-radius: 8px;">
                <h3>🍰 Distribuição de Custos</h3>
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 4px;">
                        <span style="color: #FF6384;">⛽ Combustível</span>
                        <span style="font-weight: bold;">R$ 18.500 (35%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 4px;">
                        <span style="color: #36A2EB;">👨‍💼 Motorista</span>
                        <span style="font-weight: bold;">R$ 12.000 (23%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 4px;">
                        <span style="color: #FFCE56;">🛣️ Pedágios</span>
                        <span style="font-weight: bold;">R$ 8.500 (16%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 4px;">
                        <span style="color: #4BC0C0;">🔧 Manutenção</span>
                        <span style="font-weight: bold;">R$ 6.500 (12%)</span>
                    </div>
                </div>
                <div style="margin-top: 16px; font-size: 0.8rem; color: #888;">
                    * Para gráficos interativos, carregue Chart.js
                </div>
            </div>
        `;
    }
}

// Inicializar gerenciador de gráficos
document.addEventListener('DOMContentLoaded', () => {
    // Tentar carregar Chart.js via CDN primeiro
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
        window.chartsManager = new ChartsManager();
    };
    
    script.onerror = () => {
        console.warn('Chart.js não pôde ser carregado. Usando gráficos simples.');
        window.chartsManager = new SimpleChartsManager();
    };
    
    document.head.appendChild(script);
});